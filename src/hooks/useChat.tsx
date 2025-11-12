import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/redux';
import {
    createConversation,
    getMyConversations,
    getConversations,
    getConversationById,
    sendMessage as sendMessageAction,
    getMessages,
    markAsRead,
} from '@/redux/actions/chat';
import { setCurrentConversation, addMessage } from '@/redux/reducers/chat';

import { getCookie } from './cookies';
import { useSocket } from './useSocket';

const ChatsContext = createContext({
    chatList: [] as any[],
    chat: null as any,
    messages: {} as { [key: string]: any[] },
    isLoading: false,
    loadChats: () => {},
    openChat: (conversation: any) => {},
    closeChat: () => {},
    createChat: (priority?: 'low' | 'medium' | 'high') => {},
    sendMessage: (text: string) => {},
    setIsCreateChatModalOpen: (value: boolean) => {},
    isCreateChatModalOpen: false,
});

export function ChatsProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { on, off, emit, socket } = useSocket();
    const { user } = useSelector((state: RootState) => state.auth);
    const { conversations, currentConversation, messages: reduxMessages, isLoading } = useSelector(
        (state: RootState) => state.chat
    );

    const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
    
    // Refs to prevent duplicate calls
    const markAsReadTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
    const openingChatRef = useRef<string | null>(null);
    const hasLoadedChatsRef = useRef<boolean>(false);

    // Load chats
    const loadChats = useCallback(() => {
        // Check if user is authenticated (has token)
        if (typeof window === 'undefined') {
            return;
        }
        
        const token = getCookie('token');
        if (!token) {
            // User is not authenticated - this is normal, don't load chats
            return;
        }
        
        if (!user?.id) {
            // User data not loaded yet - wait for auth to complete
            return;
        }
        
        // For admin/moderator, load all conversations
        // For regular users, load only their conversations
        const isAdminOrModerator = user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator';
        
        if (isAdminOrModerator) {
            dispatch(getConversations());
        } else {
            dispatch(getMyConversations());
        }
    }, [dispatch, user]);

    // Open chat
    const openChat = useCallback(
        async (conversation: any) => {
            if (!conversation || !conversation.id) {
                console.warn('⚠️ useChat: Cannot open chat - conversation or id is missing');
                return;
            }

            // Prevent opening the same chat multiple times
            if (currentConversation?.id === conversation.id) {
                return;
            }

            // Prevent duplicate calls to openChat for the same conversation
            if (openingChatRef.current === conversation.id) {
                return;
            }

            openingChatRef.current = conversation.id;
            
            try {
                dispatch(setCurrentConversation(conversation));

                // Join socket room
                emit('join_chat', conversation.id);

                // Load messages
                dispatch(getMessages({ conversationId: conversation.id, limit: 50, offset: 0 }));

                // Clear any existing timeout for this conversation
                if (markAsReadTimeoutRef.current[conversation.id]) {
                    clearTimeout(markAsReadTimeoutRef.current[conversation.id]);
                }

                // Mark as read with debounce to avoid rate limiting
                markAsReadTimeoutRef.current[conversation.id] = setTimeout(() => {
                    dispatch(markAsRead(conversation.id));
                    delete markAsReadTimeoutRef.current[conversation.id];
                }, 500); // Increased delay to 500ms to avoid rate limiting

                // Update URL only if not already set and pathname is /chat
                if (router.pathname === '/chat' && router.query.id !== conversation.id) {
                    router.push({
                        pathname: router.pathname,
                        query: { ...router.query, id: conversation.id },
                    }, undefined, { shallow: true });
                }
            } finally {
                // Clear the opening flag after a short delay
                setTimeout(() => {
                    if (openingChatRef.current === conversation.id) {
                        openingChatRef.current = null;
                    }
                }, 1000);
            }
        },
        [dispatch, emit, router, currentConversation?.id]
    );

    // Close chat
    const closeChat = useCallback(() => {
        if (currentConversation) {
            emit('leave_chat', currentConversation.id);
        }
        dispatch(setCurrentConversation(null));
    }, [dispatch, emit, currentConversation]);

    // Create chat
    const createChat = useCallback(
        async (priority: 'low' | 'medium' | 'high' = 'medium') => {
            if (!user?.id) return;

            try {
                const result = await dispatch(createConversation(priority));
                if (createConversation.fulfilled.match(result)) {
                    const newConversation = result.payload;
                    await openChat(newConversation);
                    setIsCreateChatModalOpen(false);
                }
            } catch (error) {
                console.error('Failed to create chat:', error);
            }
        },
        [dispatch, user, openChat]
    );

    // Send message
    const sendMessage = useCallback(
        async (text: string) => {
            if (!currentConversation || !text.trim()) {
                console.warn('Cannot send message: no conversation or empty text', { currentConversation, text });
                return;
            }

            if (!currentConversation.id) {
                console.error('Cannot send message: conversation.id is missing', currentConversation);
                return;
            }

            try {
                // Send via API
                const result = await dispatch(
                    sendMessageAction({ conversationId: currentConversation.id, content: text.trim() })
                );

                if (sendMessageAction.fulfilled.match(result)) {
                    // Message is already added to Redux via sendMessage.fulfilled
                    // Socket will handle broadcasting to other users
                    // No need to emit send_message here - it's handled on backend when API is called
                } else if (sendMessageAction.rejected.match(result)) {
                    console.error('Failed to send message:', result.error);
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        },
        [dispatch, emit, currentConversation]
    );

    // Socket event handlers
    useEffect(() => {
        if (!socket || !user?.id) return;

        // Handle new message
        const handleNewMessage = (data: { conversationId: string; message: any }) => {
            console.log('📨 New message received in useChat:', data);
            // Normalize message structure
            const normalizedMessage = {
                ...data.message,
                read: data.message.read !== undefined ? data.message.read : data.message.is_read || false,
            };
            dispatch(addMessage({ conversationId: data.conversationId, message: normalizedMessage }));
        };

        // Handle typing
        const handleTyping = (data: { userId: string; userName: string; conversationId: string }) => {
            // You can add typing indicator logic here
        };

        // Handle stopped typing
        const handleStoppedTyping = (data: { userId: string; conversationId: string }) => {
            // You can add typing indicator logic here
        };

        // Handle messages read
        const handleMessagesRead = (data: { conversationId: string; userId: string }) => {
            // Update read status - removed logging
        };

        on('new_message', handleNewMessage);
        on('user_typing', handleTyping);
        on('user_stopped_typing', handleStoppedTyping);
        on('messages_read', handleMessagesRead);

        return () => {
            off('new_message', handleNewMessage);
            off('user_typing', handleTyping);
            off('user_stopped_typing', handleStoppedTyping);
            off('messages_read', handleMessagesRead);
        };
    }, [socket, user, dispatch, on, off]);

    // Load chats on mount (but not on admin pages - they handle their own loading)
    useEffect(() => {
        // Don't auto-load on admin pages - ChatManagement handles its own loading
        if (router.pathname?.startsWith('/admin')) {
            hasLoadedChatsRef.current = false; // Reset flag when on admin page
            return;
        }
        
        // Check if user is authenticated before loading chats
        if (typeof window === 'undefined') {
            return;
        }
        
        const token = getCookie('token');
        if (!token) {
            // User is not authenticated - this is normal, don't load chats
            hasLoadedChatsRef.current = false;
            return;
        }
        
        // Prevent multiple calls to loadChats - load only once per user session
        if (user?.id && !hasLoadedChatsRef.current) {
            hasLoadedChatsRef.current = true;
            loadChats();
        }
        
        // Reset flag when user logs out or token is removed
        if (!user?.id || !token) {
            hasLoadedChatsRef.current = false;
        }
    }, [user?.id, loadChats, router.pathname]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            // Clear all markAsRead timeouts
            Object.values(markAsReadTimeoutRef.current).forEach((timeout) => {
                clearTimeout(timeout);
            });
            markAsReadTimeoutRef.current = {};
            openingChatRef.current = null;
        };
    }, []);

    // Handle URL conversation ID - removed to avoid conflicts with ChatPageContent
    // ChatPageContent handles URL-based chat opening

    const value = {
        chatList: Array.isArray(conversations) ? conversations : [],
        chat: currentConversation,
        messages: reduxMessages || {},
        isLoading,
        loadChats,
        openChat,
        closeChat,
        createChat,
        sendMessage,
        isCreateChatModalOpen,
        setIsCreateChatModalOpen,
    };

    return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChat() {
    return useContext(ChatsContext);
}

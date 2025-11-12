import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    createConversation,
    getConversations,
    getMyConversations,
    getConversationById,
    sendMessage,
    getMessages,
    markAsRead,
    getChatStats,
} from '../actions/chat';

interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_name: string;
    sender_type: 'user' | 'moderator' | 'administrator';
    content: string;
    timestamp: string;
    read: boolean;
}

interface ChatConversation {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    status: 'active' | 'waiting' | 'closed';
    priority: 'low' | 'medium' | 'high';
    last_message?: string;
    last_message_time?: string;
    unread_count: number;
    created_at: string;
    updated_at: string;
    messages?: ChatMessage[];
    user?: {
        id: string;
        avatar?: string | null;
        first_name: string;
        last_name: string;
    };
}

interface ChatState {
    conversations: ChatConversation[];
    currentConversation: ChatConversation | null;
    messages: { [conversationId: string]: ChatMessage[] };
    stats: {
        total: number;
        active: number;
        waiting: number;
        closed: number;
        totalUnread: number;
    } | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    messages: {},
    stats: null,
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentConversation: (state, action: PayloadAction<ChatConversation | null>) => {
            state.currentConversation = action.payload;
        },
        addMessage: (state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) => {
            const { conversationId, message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            
            // Normalize message structure (handle both 'read' and 'is_read')
            const normalizedMessage = {
                ...message,
                read: message.read !== undefined ? message.read : (message as any).is_read || false,
            };
            
            // Check if message already exists to avoid duplicates
            const existingIndex = state.messages[conversationId].findIndex(
                m => m.id === normalizedMessage.id
            );
            
            if (existingIndex === -1) {
                state.messages[conversationId].push(normalizedMessage);
            } else {
                // Update existing message
                state.messages[conversationId][existingIndex] = normalizedMessage;
            }
            
            // Update conversation last message
            const conversation = state.conversations.find(c => c.id === conversationId);
            if (conversation) {
                conversation.last_message = normalizedMessage.content;
                conversation.last_message_time = normalizedMessage.timestamp;
                conversation.updated_at = normalizedMessage.timestamp;
            }
        },
        updateConversation: (state, action: PayloadAction<ChatConversation>) => {
            const index = state.conversations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.conversations[index] = action.payload;
            } else {
                state.conversations.push(action.payload);
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Create conversation
        builder.addCase(createConversation.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createConversation.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.conversations.unshift(action.payload);
                state.currentConversation = action.payload;
            }
        });
        builder.addCase(createConversation.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to create conversation';
        });

        // Get conversations
        builder.addCase(getConversations.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getConversations.fulfilled, (state, action) => {
            state.isLoading = false;
            // Ensure payload is an array
            const conversations = Array.isArray(action.payload) ? action.payload : [];
            state.conversations = conversations;
        });
        builder.addCase(getConversations.rejected, (state, action) => {
            state.isLoading = false;
            // Don't set error for 401 (Unauthorized) - this is normal when user is not authenticated
            if (action.payload === 'Unauthorized') {
                state.error = null;
                state.conversations = []; // Clear conversations when unauthorized
            } else {
                state.error = action.payload as string || 'Failed to get conversations';
            }
        });

        // Get my conversations
        builder.addCase(getMyConversations.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getMyConversations.fulfilled, (state, action) => {
            state.isLoading = false;
            // Ensure payload is an array
            state.conversations = Array.isArray(action.payload) ? action.payload : [];
        });
        builder.addCase(getMyConversations.rejected, (state, action) => {
            state.isLoading = false;
            // Don't set error for 401 (Unauthorized) - this is normal when user is not authenticated
            if (action.payload === 'Unauthorized') {
                state.error = null;
                state.conversations = []; // Clear conversations when unauthorized
            } else {
                state.error = action.payload as string || 'Failed to get conversations';
            }
        });

        // Get conversation by ID
        builder.addCase(getConversationById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getConversationById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentConversation = action.payload;
            if (action.payload.messages) {
                state.messages[action.payload.id] = action.payload.messages;
            }
        });
        builder.addCase(getConversationById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to get conversation';
        });

        // Send message
        builder.addCase(sendMessage.pending, (state) => {
            state.error = null;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const message = action.payload;
            if (!message) return;
            
            // Normalize message structure (handle both 'read' and 'is_read')
            const normalizedMessage = {
                ...message,
                read: message.read !== undefined ? message.read : message.is_read || false,
            };
            
            if (!state.messages[normalizedMessage.conversation_id]) {
                state.messages[normalizedMessage.conversation_id] = [];
            }
            
            // Check if message already exists to avoid duplicates
            const existingIndex = state.messages[normalizedMessage.conversation_id].findIndex(
                m => m.id === normalizedMessage.id
            );
            
            if (existingIndex === -1) {
                state.messages[normalizedMessage.conversation_id].push(normalizedMessage);
            }
            
            // Update conversation last message
            const conversation = state.conversations.find(c => c.id === normalizedMessage.conversation_id);
            if (conversation) {
                conversation.last_message = normalizedMessage.content;
                conversation.last_message_time = normalizedMessage.timestamp;
                conversation.updated_at = normalizedMessage.timestamp;
            }
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to send message';
        });

        // Get messages
        builder.addCase(getMessages.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getMessages.fulfilled, (state, action) => {
            state.isLoading = false;
            // Ensure payload is an array
            if (!Array.isArray(action.payload)) {
                return;
            }
            // Messages are returned in reverse order (newest first), so we reverse them
            const messages = [...action.payload].reverse();
            const conversationId = messages[0]?.conversation_id;
            if (conversationId) {
                state.messages[conversationId] = messages;
            }
        });
        builder.addCase(getMessages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to get messages';
        });

        // Mark as read
        builder.addCase(markAsRead.fulfilled, (state, action) => {
            const conversationId = action.payload;
            const conversation = state.conversations.find(c => c.id === conversationId);
            if (conversation) {
                conversation.unread_count = 0;
            }
            // Mark messages as read
            if (state.messages[conversationId]) {
                state.messages[conversationId].forEach(msg => {
                    msg.read = true;
                });
            }
        });

        // Get chat stats
        builder.addCase(getChatStats.fulfilled, (state, action) => {
            state.stats = action.payload;
        });
    },
});

export const { setCurrentConversation, addMessage, updateConversation, clearError } = chatSlice.actions;
export default chatSlice.reducer;


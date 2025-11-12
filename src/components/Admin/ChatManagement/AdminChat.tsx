'use client';

import { useEffect } from 'react';

import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import MessageArea from '@/components/Chat/MessageArea';
import MessageInput from '@/components/Chat/MessageInput';
import { useSocket } from '@/hooks/useSocket';
import { RootState } from '@/redux';
import { sendMessage as sendMessageAction, getConversations } from '@/redux/actions/chat';
import { addMessage } from '@/redux/reducers/chat';

interface AdminChatProps {
    conversation: any;
    onClose: () => void;
}

const AdminChat = ({ conversation, onClose }: AdminChatProps) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { emit, on, off } = useSocket();
    const { messages: reduxMessages } = useSelector((state: RootState) => state.chat);
    const { user } = useSelector((state: RootState) => state.auth);

    const conversationMessages = conversation ? (reduxMessages[conversation.id] || []) : [];

    useEffect(() => {
        if (!conversation) return;

        // Join socket room
        emit('join_chat', conversation.id);

        // Handle new messages
        const handleNewMessage = (data: { conversationId: string; message: any }) => {
            if (data.conversationId === conversation.id) {
                console.log('📨 New message received in AdminChat:', data);
                // Normalize message structure
                const normalizedMessage = {
                    ...data.message,
                    read: data.message.read !== undefined ? data.message.read : data.message.is_read || false,
                };
                dispatch(addMessage({ conversationId: data.conversationId, message: normalizedMessage }));
            }
        };

        on('new_message', handleNewMessage);

        return () => {
            off('new_message', handleNewMessage);
            emit('leave_chat', conversation.id);
        };
    }, [conversation, emit, on, off, dispatch]);

    const handleSendMessage = async (text: string) => {
        if (!conversation || !text.trim()) return;

        try {
            const result = await dispatch(
                sendMessageAction({ conversationId: conversation.id, content: text.trim() })
            );

            if (sendMessageAction.fulfilled.match(result)) {
                // Message is already added to Redux via sendMessage.fulfilled
                // Socket will handle broadcasting to other users
                // Refresh conversations list to update last message
                dispatch(getConversations());
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (!conversation) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: '500px',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1300,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <ChevronLeft
                    onClick={onClose}
                    sx={{ cursor: 'pointer', fontSize: '28px' }}
                />
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        {conversation.user_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {conversation.user_email}
                    </Typography>
                </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <MessageArea
                    messages={conversationMessages}
                    onLoadMore={() => {}}
                />
            </Box>

            {/* Input */}
            <Box sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                <MessageInput onSendMessage={handleSendMessage} />
            </Box>
        </Box>
    );
};

export default AdminChat;


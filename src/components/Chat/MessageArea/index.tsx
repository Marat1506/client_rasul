import React, { useEffect, useRef } from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux';
import { formatDate } from '@/utils';


const groupMessagesByDate = (messages: any) => {
    const grouped: any = {};
    messages?.forEach((message: any) => {
        const date = new Date(message.timestamp || message.posted).toDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(message);
    });
    return Object.entries(grouped).map(([date, messages]) => ({date, messages}));
}; 

const MessageArea = ({messages, onLoadMore}: { messages: any[], onLoadMore: () => void }) => {
    const safeMessages = Array.isArray(messages) ? messages : [];
    const groupedMessages = groupMessagesByDate(safeMessages);
    const scrollRef = useRef<HTMLDivElement>(null);
    const {user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    const handleScroll = (e: React.UIEvent) => {
        // const scrollTop = e.currentTarget.scrollTop;
        // if (scrollTop === 0) {
        //     onLoadMore();
        // }
    };

    return (
        <Box
            width="100%"
            height="100%"
            overflow="auto"
            display="flex"
            flexDirection="column"
            gap={2}
            padding={2}
            component={Paper}
            // justifyContent="end"
            sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: 1,
                '&::-webkit-scrollbar': {display: 'none'},
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
            }}
            ref={scrollRef}
            onScroll={handleScroll}
        >
            {groupedMessages.map(({ date, messages }: any) => (
                <Box key={date} display="flex" flexDirection="column" gap={'1px'}>
                    <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{ padding: '0 8px', color: (theme) => theme.palette.primary.main }}
                        >
                            {formatDate(new Date(date).getTime())}
                        </Typography>
                    </Box>

                    {messages?.map((message: any, index: number) => {
                        const messageTime = message.timestamp || message.posted;
                        const currentTime = new Date(messageTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        });
                        const nextMessage = messages[index + 1];
                        
                        // Определяем, является ли сообщение от текущего пользователя
                        // Проверяем и sender_id (строка) и приводим к строке для надежности
                        const currentUserId = user?.id ? String(user.id) : null;
                        const senderId = message.sender_id ? String(message.sender_id) : null;
                        const isCurrentUser = currentUserId && senderId && currentUserId === senderId;

                        const showTime = !nextMessage || 
                            (nextMessage.sender_id ? String(nextMessage.sender_id) : null) !== senderId;
                        const messageContent = message.content || message.title || '';
                        const senderName = message.sender_name || '';
                        const senderType = message.sender_type || 'user';

                        // Определяем цвет сообщения в зависимости от типа отправителя
                        const getMessageColor = (isCurrent: boolean, type: string) => {
                            if (isCurrent) {
                                return (theme: any) => theme.palette.primary.main;
                            }
                            if (type === 'administrator') {
                                return (theme: any) => theme.palette.error.light;
                            }
                            if (type === 'moderator') {
                                return (theme: any) => theme.palette.warning.light;
                            }
                            return (theme: any) => theme.palette.grey[200];
                        };

                        return (
                            <Box
                                key={message.id || index}
                                display="flex"
                                flexDirection={isCurrentUser ? 'row-reverse' : 'row'}
                                alignItems="flex-start"
                                gap={1}
                            >
                                <Box 
                                    display="flex" 
                                    flexDirection="column" 
                                    gap={0.5} 
                                    maxWidth="70%" 
                                    minWidth="50px"
                                    sx={{
                                        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {/* Имя отправителя для сообщений от других пользователей */}
                                    {!isCurrentUser && senderName && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 600,
                                                color: (theme) => {
                                                    if (senderType === 'administrator') return theme.palette.error.main;
                                                    if (senderType === 'moderator') return theme.palette.warning.main;
                                                    return theme.palette.text.secondary;
                                                },
                                                marginLeft: '4px',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {senderName}
                                            {senderType === 'administrator' && ' (Администратор)'}
                                            {senderType === 'moderator' && ' (Модератор)'}
                                        </Typography>
                                    )}
                                    
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            padding: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: getMessageColor(isCurrentUser, senderType),
                                            color: isCurrentUser ? (theme) => theme.palette.primary.contrastText : 'inherit',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {messageContent}
                                    </Typography>

                                    {showTime && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                                                marginLeft: isCurrentUser ? 'unset' : '4px',
                                                marginRight: isCurrentUser ? '4px' : 'unset',
                                                color: (theme) => theme.palette.text.secondary,
                                            }}
                                        >
                                            {currentTime}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            ))}
        </Box>
    );
};

export default MessageArea;

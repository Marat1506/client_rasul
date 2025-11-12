import React, { useState, useEffect } from 'react';

import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import ReplyIcon from '@mui/icons-material/Reply';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Chip,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Container,
    Snackbar,
    Alert,
    Pagination,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { useSocket } from '@/hooks/useSocket';
import { RootState } from '@/redux';
import {
    getConversations,
    getConversationById,
    sendMessage as sendMessageAction,
    getMessages,
    markAsRead,
    getChatStats,
} from '@/redux/actions/chat';
import { addMessage, setCurrentConversation } from '@/redux/reducers/chat';

import AdminChat from './AdminChat';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 2 }}>{children}</Box>}</div>;
}

const ChatManagement = () => {
    const dispatch = useDispatch();
    const { emit, on, off } = useSocket();
    const { conversations, currentConversation, messages: reduxMessages, stats, isLoading } = useSelector(
        (state: RootState) => state.chat
    );
    const { user } = useSelector((state: RootState) => state.auth);

    const [tabValue, setTabValue] = useState(0);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' as 'success' | 'error' | 'warning' | 'info',
    });

    useEffect(() => {
        // Load conversations and stats
        console.log('🚀 ChatManagement: Loading conversations on mount');
        dispatch(getConversations(undefined));
        dispatch(getChatStats());
    }, [dispatch]);
    
    // Removed excessive logging

    // Socket event handlers
    useEffect(() => {
        const handleNewMessage = (data: { conversationId: string; message: any }) => {
            console.log('📨 New message received in admin:', data);
            // Normalize message structure
            const normalizedMessage = {
                ...data.message,
                read: data.message.read !== undefined ? data.message.read : data.message.is_read || false,
            };
            dispatch(addMessage({ conversationId: data.conversationId, message: normalizedMessage }));
            // Refresh conversations list
            dispatch(getConversations(undefined));
        };

        on('new_message', handleNewMessage);

        return () => {
            off('new_message', handleNewMessage);
        };
    }, [dispatch, on, off]);

    const handleViewChat = async (conversation: any) => {
        setSelectedConversation(conversation);
        setViewDialogOpen(true);

        // Load conversation details and messages
        await dispatch(getConversationById(conversation.id));
        await dispatch(getMessages({ conversationId: conversation.id, limit: 50, offset: 0 }));
        await dispatch(markAsRead(conversation.id));

        // Join socket room
        emit('join_chat', conversation.id);
    };

    const handleOpenChat = async (conversation: any) => {
        setSelectedConversation(conversation);
        setChatOpen(true);

        // Load conversation details and messages
        await dispatch(getConversationById(conversation.id));
        await dispatch(getMessages({ conversationId: conversation.id, limit: 50, offset: 0 }));
        await dispatch(markAsRead(conversation.id));
        dispatch(setCurrentConversation(conversation));

        // Join socket room
        emit('join_chat', conversation.id);
    };

    const handleCloseChat = () => {
        if (selectedConversation) {
            emit('leave_chat', selectedConversation.id);
        }
        setChatOpen(false);
        setSelectedConversation(null);
        dispatch(setCurrentConversation(null));
    };

    const handleReply = async (conversation: any) => {
        setSelectedConversation(conversation);
        setReplyDialogOpen(true);

        // Load conversation if not loaded
        if (!currentConversation || currentConversation.id !== conversation.id) {
            await dispatch(getConversationById(conversation.id));
            await dispatch(getMessages({ conversationId: conversation.id, limit: 50, offset: 0 }));
        }

        // Join socket room
        emit('join_chat', conversation.id);
    };

    const handleSendReply = async () => {
        if (selectedConversation && newMessage.trim()) {
            try {
                await dispatch(
                    sendMessageAction({ conversationId: selectedConversation.id, content: newMessage.trim() })
                );

                // Also emit via socket
                emit('send_message', {
                    conversationId: selectedConversation.id,
                    content: newMessage.trim(),
                });

                setNewMessage('');
                setReplyDialogOpen(false);
                setNotification({ open: true, message: 'Ответ отправлен', severity: 'success' });

                // Refresh conversations
                dispatch(getConversations(undefined));
            } catch (error) {
                setNotification({ open: true, message: 'Ошибка при отправке сообщения', severity: 'error' });
            }
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

    // Ensure conversations is always an array
    const conversationsList = Array.isArray(conversations) ? conversations : [];

    const displayStats = stats || {
        total: conversationsList.length,
        active: conversationsList.filter((c) => c.status === 'active').length,
        waiting: conversationsList.filter((c) => c.status === 'waiting').length,
        closed: conversationsList.filter((c) => c.status === 'closed').length,
        totalUnread: conversationsList.reduce((sum, c) => sum + (c.unread_count || 0), 0),
    };

    const paginatedConversations = conversationsList.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const getStatusColor = (status: string) =>
        status === 'active' ? 'success' : status === 'waiting' ? 'warning' : 'default';
    const getPriorityColor = (priority: string) =>
        priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'info';

    const conversationMessages = selectedConversation
        ? reduxMessages[selectedConversation.id] || []
        : [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary' }}>
                Управление чатом поддержки
            </Typography>

            {/* Статистика */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Всего чатов', value: displayStats.total, color: 'primary' },
                    { label: 'Активные', value: displayStats.active, color: 'success' },
                    { label: 'Ожидают ответа', value: displayStats.waiting, color: 'warning' },
                    { label: 'Непрочитанные', value: displayStats.totalUnread, color: 'error' },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                bgcolor: '#f9f9f9',
                                boxShadow: 2,
                            }}
                        >
                            <Box sx={{ mr: 2 }}>
                                <Chip label={stat.value} color={stat.color as any} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000' }}>
                                {stat.label}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 2, bgcolor: 'white' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab icon={<ChatIcon />} label={`Активные чаты (${displayStats.active})`} />
                    <Tab icon={<HistoryIcon />} label="История чатов" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : conversationsList.length === 0 ? (
                        <Typography>Пока нет чатов</Typography>
                    ) : (
                        <>
                            <TableContainer component={Paper} sx={{ mt: 2, bgcolor: 'white' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Пользователь</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Последнее сообщение</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Приоритет</TableCell>
                                            <TableCell>Непрочитано</TableCell>
                                            <TableCell>Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedConversations.map((c) => (
                                            <TableRow key={c.id} hover>
                                                <TableCell>{c.user_name}</TableCell>
                                                <TableCell>{c.user_email}</TableCell>
                                                <TableCell>{c.last_message || 'Нет сообщений'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={c.status}
                                                        color={getStatusColor(c.status) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={c.priority}
                                                        color={getPriorityColor(c.priority) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {c.unread_count > 0 && (
                                                        <Chip label={c.unread_count} color="error" size="small" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        onClick={() => handleOpenChat(c)}
                                                        title="Открыть чат"
                                                    >
                                                        <ChatIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleViewChat(c)} title="Просмотр">
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleReply(c)} title="Быстрый ответ">
                                                        <ReplyIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    count={Math.ceil(conversationsList.length / rowsPerPage)}
                                    page={page}
                                    onChange={(_, p) => setPage(p)}
                                />
                            </Box>
                        </>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Typography>История чатов</Typography>
                </TabPanel>
            </Paper>

            {/* Просмотр чата */}
            <Dialog
                PaperProps={{
                    sx: {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        minWidth: '500px',
                        maxHeight: '80vh',
                    },
                }}
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Чат с {selectedConversation?.user_name}</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        {conversationMessages.length === 0 ? (
                            <Typography>Нет сообщений</Typography>
                        ) : (
                            conversationMessages.map((m: any) => {
                                // Определяем, является ли сообщение от текущего пользователя
                                const currentUserId = user?.id ? String(user.id) : null;
                                const senderId = m.sender_id ? String(m.sender_id) : null;
                                const isCurrentUser = currentUserId && senderId && currentUserId === senderId;
                                
                                // Определяем цвет сообщения в зависимости от типа отправителя
                                const getMessageColor = () => {
                                    if (isCurrentUser) return 'primary.main';
                                    if (m.sender_type === 'administrator') return 'error.light';
                                    if (m.sender_type === 'moderator') return 'warning.light';
                                    return 'grey.200';
                                };

                                const getSenderLabel = () => {
                                    if (m.sender_type === 'administrator') return ' (Администратор)';
                                    if (m.sender_type === 'moderator') return ' (Модератор)';
                                    return '';
                                };

                                return (
                                    <Box
                                        key={m.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                            mb: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: getMessageColor(),
                                                color: isCurrentUser ? 'primary.contrastText' : 'inherit',
                                                maxWidth: '70%',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {!isCurrentUser && m.sender_name && (
                                                <Typography 
                                                    variant="caption" 
                                                    display="block" 
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: m.sender_type === 'administrator' ? 'error.main' :
                                                               m.sender_type === 'moderator' ? 'warning.main' :
                                                               'text.secondary',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {m.sender_name}{getSenderLabel()}
                                                </Typography>
                                            )}
                                            <Typography variant="body1">{m.content}</Typography>
                                            <Typography 
                                                variant="caption" 
                                                display="block" 
                                                sx={{ 
                                                    color: isCurrentUser ? 'primary.contrastText' : 'text.secondary',
                                                    mt: 0.5,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {new Date(m.timestamp).toLocaleString('ru-RU')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            {/* Ответ */}
            <Dialog
                open={replyDialogOpen}
                onClose={() => setReplyDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Ответ пользователю {selectedConversation?.user_name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, maxHeight: '300px', overflowY: 'auto' }}>
                        {conversationMessages.slice(-5).map((m: any) => (
                            <Box key={m.id} sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {m.sender_name}: {m.content}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите ваш ответ..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReplyDialogOpen(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleSendReply} disabled={!newMessage.trim()}>
                        Отправить
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity}>{notification.message}</Alert>
            </Snackbar>

            {/* Full chat interface */}
            {chatOpen && selectedConversation && (
                <>
                    <AdminChat conversation={selectedConversation} onClose={handleCloseChat} />
                    {/* Overlay to darken the background */}
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1299,
                        }}
                        onClick={handleCloseChat}
                    />
                </>
            )}
        </Container>
    );
};

export default ChatManagement;

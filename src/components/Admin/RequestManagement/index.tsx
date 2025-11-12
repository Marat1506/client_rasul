import React, {useEffect, useState} from 'react';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Typography, 
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    Zoom,
    Grid,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
    useMediaQuery,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {requests} from '@/redux/actions/contents';
import Api from '@/services';
import {getAvatarUrl} from '@/utils/avatar';

const RequestManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({open: false, message: '', severity: 'info'});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {data, isLoading} = useSelector((store: RootState) => store.contents.requests);

    useEffect(() => {
        dispatch(requests());
    }, [dispatch]);

    const handleMoreClick = (request: any) => {
        setSelectedRequest(request);
    };

    const handleCloseDetails = () => {
        setSelectedRequest(null);
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageDialogOpen(true);
    };

    const handleCloseImageDialog = () => {
        setImageDialogOpen(false);
        setSelectedImage('');
    };

    const handleDeleteClick = (request: any) => {
        setRequestToDelete(request);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!requestToDelete) return;

        setIsDeleting(true);
        try {
            await Api.deleteRequest(requestToDelete.id);

            setNotification({
                open: true,
                message: 'Заявка успешно удалена',
                severity: 'success',
            });

            dispatch(requests());
            setDeleteDialogOpen(false);
            setRequestToDelete(null);

        } catch (error: any) {
            console.error('Error deleting request:', error);
            setNotification({
                open: true,
                message: error?.response?.data?.errors?.[0] || 'Ошибка при удалении заявки',
                severity: 'error',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setRequestToDelete(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredRequests = data?.data?.filter((request: any) => {
        return request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.phone.includes(searchTerm);
    }) || [];

    if (isLoading) {
        return (
            <Box
                sx={{
                    p: 3,
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: isMobile ? 1 : 3,
                minHeight: '100vh',
            }}
        >
            <Zoom in timeout={500}>
                <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{
                        fontWeight: 800,
                        background: theme.palette.primary.main,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 3,
                    }}
                >
                    Управление заявками
                </Typography>
            </Zoom>

            {isMobile ? (
                <Fade in timeout={800}>
                    <Box>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request: any) => (
                                <Card key={request.id} sx={{ mb: 2, p: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {request.name}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            {request.email}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            {request.phone}
                                        </Typography>
                                        <Chip
                                            label={formatDate(request.date_created)}
                                            size="small"
                                            sx={{ mb: 2 }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ textTransform: 'none', flex: 1 }}
                                                onClick={() => handleMoreClick(request)}
                                            >
                                                Подробнее
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                sx={{ textTransform: 'none', flex: 1 }}
                                                onClick={() => handleDeleteClick(request)}
                                                disabled={isDeleting}
                                            >
                                                Удалить
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Box sx={{ py: 3, textAlign: 'center' }}>
                                <Typography variant="body1" color="text.secondary">
                                    {data?.data?.length === 0 ? 'Нет заявок' : 'Заявки не найдены'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Fade>
            ) : (
                <Fade in timeout={800}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: 1,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Имя</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Телефон</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Дата создания</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request: any) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.name}</TableCell>
                                            <TableCell>{request.email}</TableCell>
                                            <TableCell>{request.phone}</TableCell>
                                            <TableCell>{formatDate(request.date_created)}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        mr: 1,
                                                        textTransform: 'none',
                                                    }}
                                                    onClick={() => handleMoreClick(request)}
                                                >
                                                    Подробнее
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={() => handleDeleteClick(request)}
                                                    disabled={isDeleting}
                                                >
                                                    Удалить
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body1" color="text.secondary">
                                                {data?.data?.length === 0 ? 'Нет заявок' : 'Заявки не найдены'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fade>
            )}

            <Dialog
                open={!!selectedRequest}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        backgroundColor: 'white',
                        borderRadius: isMobile ? 0 : 2,
                        p: 2,
                    },
                }}
            >
                {selectedRequest && (
                    <>
                        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Детали заявки
                            <IconButton onClick={handleCloseDetails}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Информация о заявке</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">Имя:</Typography>
                                        <Typography variant="body1">{selectedRequest.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">Email:</Typography>
                                        <Typography variant="body1">{selectedRequest.email}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">Телефон:</Typography>
                                        <Typography variant="body1">{selectedRequest.phone}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">Дата создания:</Typography>
                                        <Typography variant="body1">{formatDate(selectedRequest.date_created)}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">ID заявки:</Typography>
                                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {selectedRequest.id}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Сообщение</Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'grey.50',
                                        minHeight: '80px'
                                    }}
                                >
                                    <Typography variant="body1">{selectedRequest.message}</Typography>
                                </Paper>
                            </Box>

                            {selectedRequest.images && selectedRequest.images.length > 0 ? (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Изображения</Typography>
                                    <Grid container spacing={1}>
                                        {selectedRequest.images.map((image: string, index: number) => {
                                            const imageUrl = getAvatarUrl(image);
                                            return (
                                                <Grid item key={index}>
                                                    <Box
                                                        component="img"
                                                        src={imageUrl || image}
                                                        alt={`Изображение ${index + 1}`}
                                                        sx={{
                                                            width: 100,
                                                            height: 100,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                            },
                                                        }}
                                                        onClick={() => handleImageClick(imageUrl || image)}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Изображения</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Изображения не прикреплены
                                    </Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails}>Закрыть</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Dialog
                open={imageDialogOpen}
                onClose={handleCloseImageDialog}
                maxWidth="lg"
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden',
                    },
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleCloseImageDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                            },
                            zIndex: 1,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={getAvatarUrl(selectedImage) || selectedImage}
                        alt="Увеличенное изображение"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        backgroundColor: 'white',
                        borderRadius: isMobile ? 0 : 1,
                        p: 2,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Удалить заявку?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить заявку от <strong>{requestToDelete?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Email: {requestToDelete?.email}
                    </Typography>
                    <Typography variant="body2">
                        Дата: {requestToDelete ? formatDate(requestToDelete.date_created) : ''}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={isDeleting}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={16} /> : null}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({...notification, open: false})}
            >
                <Alert
                    onClose={() => setNotification({...notification, open: false})}
                    severity={notification.severity}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RequestManagement;
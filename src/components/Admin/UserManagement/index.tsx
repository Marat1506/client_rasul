import React, {useState, useEffect} from 'react';

import {
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell, 
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Stack,
    IconButton,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Tooltip,
    CircularProgress,
    Zoom,
    useMediaQuery,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {users} from '@/redux/actions/contents';
import Api from '@/services';


interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: any;
}

const UserManagement = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {data: allUsers, isLoading} = useSelector((store: RootState) => store.contents.users);
    const data = allUsers.data;
    const [usersData, setUsersData] = useState<User[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({open: false, message: '', severity: 'info'});

    useEffect(() => {
        dispatch(users());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            const usersArray = Array.isArray(data) ? data : [];
            setUsersData(usersArray);
        }
    }, [data]);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditedUser({...user});
        setEditDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleSaveUser = () => {
        if (selectedUser && editedUser) {
            const updatedUsers = usersData.map(user =>
                user.id === selectedUser.id ? {...user, ...editedUser} : user
            );
            setUsersData(updatedUsers);
            setNotification({
                open: true,
                message: 'Пользователь успешно обновлен',
                severity: 'success',
            });
        }
        setEditDialogOpen(false);
        setSelectedUser(null);
        setEditedUser({});
    };

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                await Api.deleteUser([selectedUser.id]);
                const updatedUsers = usersData.filter(user => user.id !== selectedUser.id);
                setUsersData(updatedUsers);
                setNotification({
                    open: true,
                    message: `Пользователь ${selectedUser.first_name} ${selectedUser.last_name} удален`,
                    severity: 'success',
                });
            } catch (error: any) {
                setNotification({
                    open: true,
                    message: error?.response?.data?.errors?.[0] || 'Ошибка при удалении пользователя',
                    severity: 'error',
                });
            }
        }
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    if (isLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{p: 1}}>
            <Box sx={{mb: 4}}>
                <Zoom in timeout={500}>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        sx={{
                            fontWeight: 800,
                            background: theme.palette.primary.main,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                        }}
                    >
                        Управление пользователх
                    </Typography>
                </Zoom>
                <Zoom in timeout={500}>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 800,
                            background: theme.palette.primary.main,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 3,
                        }}
                    >
                        Обзор и управление пользователями системы
                    </Typography>
                </Zoom>
            </Box>

            <Card>
                <CardContent sx={{p: 0}}>
                    {isMobile ? (
                        <Box sx={{p: 2}}>
                            {usersData.length > 0 ? (
                                usersData.map((user) => (
                                    <Card key={user.id} sx={{mb: 2, p: 2}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                <Avatar>
                                                    {user.first_name[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {user.first_name} {user.last_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteUser(user)}
                                                    color="error"
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Card>
                                ))
                            ) : (
                                <Box sx={{py: 3, textAlign: 'center'}}>
                                    <Typography variant="body1" color="text.secondary">
                                        Нет данных о пользователях
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: 700}}>Пользователь</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>Email</TableCell>
                                        <TableCell align={'right'} sx={{fontWeight: 700}}>Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usersData.length > 0 ? (
                                        usersData.map((user) => (
                                            <TableRow key={user.id} hover>
                                                <TableCell>
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                        <Avatar>
                                                            {user.first_name[0]}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {user.first_name} {user.last_name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell align={'right'}>
                                                    <Tooltip title="Удалить">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteUser(user)}
                                                            color="error"
                                                        >
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{py: 3}}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Нет данных о пользователях
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>Редактировать пользователя</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt: 1}}>
                        <TextField
                            label="Имя"
                            fullWidth
                            value={editedUser.first_name || ''}
                            onChange={(e) => setEditedUser({...editedUser, last_name: e.target.value})}
                        />
                        <TextField
                            label="Фамилия"
                            fullWidth
                            value={editedUser.last_name || ''}
                            onChange={(e) => setEditedUser({...editedUser, last_name: e.target.value})}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={editedUser.email || ''}
                            onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Роль</InputLabel>
                            <Select
                                value={editedUser.role || ''}
                                label="Роль"
                                onChange={(e) => setEditedUser({...editedUser, role: e.target.value as any})}
                            >
                                <MenuItem value="user">Пользователь</MenuItem>
                                <MenuItem value="moderator">Модератор</MenuItem>
                                <MenuItem value="Administrator">Администратор</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleSaveUser} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                PaperProps={{ sx: { backgroundColor: 'white', backgroundImage: 'none' } }}
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                fullScreen={isMobile}
            >
                <DialogTitle>Подтвердить удаление</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить пользователя {selectedUser?.first_name} {selectedUser?.last_name}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Удалить
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

export default UserManagement;
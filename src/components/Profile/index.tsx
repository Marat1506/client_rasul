import { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Grid,
    InputAdornment, 
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AvatarUpload from '@/components/Profile/AvatarUpload';
import ResetPassword from '@/components/Profile/ResetPassword';
import useAppDispatch from '@/hooks/useAppDispatch';
import { RootState } from '@/redux';
import { clean, resettingUser, getCurrentUser } from '@/redux/actions/auth';

import { PencleInputIcon } from '../../../public/svg';

const InfoForm = ({ formik }: { formik: any }) => {
    return (
        <>
            <Grid container spacing={2} mt={3}>
                {[
                    { name: 'first_name', label: 'First Name' },
                    { name: 'last_name', label: 'Last Name' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'description', label: 'Description' },
                ].map(({ name, label, type = 'text' }) => (
                    <Grid item xs={12} sm={6} key={name}>
                        <TextField
                            fullWidth
                            label={label}
                            variant="outlined"
                            type={type}
                            {...formik.getFieldProps(name)}
                            error={formik.touched[name] && Boolean(formik.errors[name])}
                            helperText={formik.touched[name] && formik.errors[name]}
                            sx={{
                                '& div': {
                                    backgroundColor: (theme) => theme.palette.background.paper,
                                    color: (theme) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme) => theme.palette.secondary.dark,
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <PencleInputIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

const Profile = () => {
    const theme = useTheme();
    const [toggle, setToggle] = useState('info');
    const [isClient, setIsClient] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);
    const [avatarFile, setAvatarFile] = useState<string>(user?.avatar || '');
    
    // Обновляем avatarFile когда user обновляется
    useEffect(() => {
        if (user?.avatar) {
            setAvatarFile(user.avatar);
        }
    }, [user?.avatar]);
    const dispatch = useAppDispatch();
    const { isFail, isSuccess, message } = useSelector(
        (state: RootState) => state.auth.resettingUser
    );

    useEffect(() => {
        setIsClient(true);
        // Всегда загружаем данные пользователя при монтировании компонента профиля
        // чтобы убедиться что у нас актуальные данные с аватаром
        dispatch(getCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        if (isFail) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success(message);
            // После успешного обновления профиля НЕ вызываем getCurrentUser,
            // так как resettingUser.fulfilled уже обновляет state.user с актуальными данными
            // включая аватар. Вызов getCurrentUser может перезаписать аватар на undefined,
            // если Prisma Client не обновлен или есть проблема с чтением из БД.
        }
        dispatch(clean());
    }, [isFail, message, isSuccess, dispatch]);

    const formik = useFormik({
        enableReinitialize: true, // Переинициализируем formik при изменении user
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            avatar: user?.avatar || '',
            description: user?.description || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            avatar: Yup.string(),
            description: Yup.string(),
        }),
        onSubmit: (values) => {
            console.log('Submitting profile update:', { ...values, avatar: avatarFile || null });
            dispatch(resettingUser({ ...values, avatar: avatarFile || null }));
        },
    });

    const handleAvatarFileChange = (file: string) => {
        console.log('handleAvatarFileChange called with:', file);
        setAvatarFile(file);
        // Используем setTimeout чтобы formik успел обновиться
        setTimeout(() => {
            formik.setFieldValue('avatar', file);
            console.log('avatarFile updated to:', file);
            console.log('formik values after setFieldValue:', formik.values);
        }, 0);
    };

    // Prevent hydration mismatch by not rendering until client-side
    if (!isClient) {
        return (
            <Box>
                <Typography
                    mt="50px"
                    mb="20px"
                    variant="h3"
                    fontWeight={700}
                    color="text.primary"
                >
                    Profile
                </Typography>
                <Paper
                    sx={{
                        backgroundColor: (theme) => theme.palette.background.paper,
                        p: 3,
                        minHeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography>Loading...</Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Typography
                mt="50px"
                mb="20px"
                variant="h3"
                fontWeight={700}
                color="text.primary"
            >
                Profile
            </Typography>

            <Paper
                sx={{
                    backgroundColor: (theme) => theme.palette.background.paper,
                    p: 3,
                }}
            >
                <Box
                    sx={{
                        border: `1px solid ${theme.palette.primary.light}`,
                        display: 'flex',
                        gap: '2px',
                        width: 'max-content',
                        borderRadius: '9px',
                        mb: 5,
                    }}
                >
                    <Box>
                        <Button
                            onClick={() => setToggle('info')}
                            size={'small'}
                            sx={{
                                borderRadius: '8px',
                                padding: '8px 10px',
                                backgroundColor: (theme) =>
                                    toggle === 'info'
                                        ? theme.palette.primary.light
                                        : 'transparent',
                            }}
                        >
                            <Typography
                                component={'label'}
                                color={toggle === 'info' ? 'white' : 'text.primary'}
                                variant={'subtitle1'}
                                fontWeight={600}
                            >
                                Information
                            </Typography>
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            onClick={() => setToggle('password')}
                            size={'small'}
                            sx={{
                                borderRadius: '8px',
                                padding: '8px 10px',
                                backgroundColor: (theme) =>
                                    toggle === 'password'
                                        ? theme.palette.primary.light
                                        : 'transparent',
                            }}
                        >
                            <Typography
                                component={'label'}
                                color={toggle === 'password' ? 'white' : 'text.primary'}
                                variant={'subtitle1'}
                                fontWeight={600}
                            >
                                Password
                            </Typography>
                        </Button>
                    </Box>
                </Box>

                {toggle === 'info' && (
                    <AvatarUpload toggle={toggle} onFileChange={handleAvatarFileChange} />
                )}

                {toggle === 'info' && (
                    <form onSubmit={formik.handleSubmit}>
                        <InfoForm formik={formik} />
                        <Box display="flex" justifyContent="end" gap={2}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ height: 50, mt: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    height: 50,
                                    mt: 2,
                                    background: (theme) => theme.palette.primary.main,
                                }}
                            >
                                Save changes
                            </Button>
                        </Box>
                    </form>
                )}

                {toggle === 'password' && <ResetPassword />}
            </Paper>
        </Box>
    );
};

export default Profile;
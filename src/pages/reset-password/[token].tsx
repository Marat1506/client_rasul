import React, {useState, useEffect} from 'react';

import {
    TextField,
    Grid,
    Button,
    Box,
    InputAdornment,
    Paper, Typography,
} from '@mui/material';
import {useFormik} from 'formik';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import * as Yup from 'yup';

import {RootState} from '@/redux';

import {HidePasswordIcon, ShowPasswordIcon} from '../../../public/svg';
import Api from '../../services';

const Token = () => {
    const router = useRouter();
    const {isAuthorization} = useSelector((state: RootState) => state.auth);
    const {token} = router.query;

    const [passwordVisibility, setPasswordVisibility] = useState({
        newPassword: false,
        repeatPassword: false,
    });
 
    const togglePasswordVisibility = (field: 'newPassword' | 'repeatPassword') => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            repeatPassword: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .required('New password is required'),
            repeatPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Password confirmation is required'),
        }),
        onSubmit: async (values) => {
            try {
                if (!token || typeof token !== 'string') {
                    toast.error('Недействительный токен восстановления пароля');
                    return;
                }
                const {data} = await Api.newPassword({token, newPassword: values.newPassword});
                toast.success(data.message || 'Пароль успешно изменен');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 1500);
            } catch (error: any) {
                let errorMessage = 'Ошибка при сбросе пароля';
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.request?.responseText) {
                    try {
                        const errorData = JSON.parse(error.request.responseText);
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        errorMessage = 'Ошибка при сбросе пароля';
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
            }
        },
    });

    return (
        <Box>
            <Typography mt="50px" mb="20px" variant="h3" fontWeight={700} color="text.primary">
                {isAuthorization ? 'Reset Password' : 'Password Recovery'}
            </Typography>

            <Paper
                sx={{
                    backgroundColor: (theme: any) => theme.palette.background.paper,
                    p: 3,
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} mt={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="New password"
                                variant="outlined"
                                type={passwordVisibility.newPassword ? 'text' : 'password'}
                                {...formik.getFieldProps('newPassword')}
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={() => togglePasswordVisibility('newPassword')}
                                                sx={{minWidth: 0}}
                                            >
                                                {passwordVisibility.newPassword ? <HidePasswordIcon/> :
                                                    <ShowPasswordIcon/>}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& div': {
                                        backgroundColor: (theme: any) => theme.palette.background.paper,
                                        color: (theme: any) => theme.palette.secondary.dark,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Confirm password"
                                variant="outlined"
                                type={passwordVisibility.repeatPassword ? 'text' : 'password'}
                                {...formik.getFieldProps('repeatPassword')}
                                error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                                helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={() => togglePasswordVisibility('repeatPassword')}
                                                sx={{minWidth: 0}}
                                            >
                                                {passwordVisibility.repeatPassword ? <HidePasswordIcon/> :
                                                    <ShowPasswordIcon/>}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& div': {
                                        backgroundColor: (theme: any) => theme.palette.background.paper,
                                        color: (theme: any) => theme.palette.secondary.dark,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="end" mt={3} gap={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{height: 50, background: (theme) => theme.palette.primary.main}}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Token;

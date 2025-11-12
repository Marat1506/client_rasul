import {useEffect, useState, useRef} from 'react';
import React from 'react';

import {
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/system';
import {useFormik} from 'formik';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import * as Yup from 'yup';
 
import useAppDispatch from '@/hooks/useAppDispatch';
import {Register} from '@/interfaces';
import {RootState} from '@/redux';
import {clean, register} from '@/redux/actions/auth';


import ShowAndHidePassword from '../LogIn/components/ShowAndHidePassword';

const Registration = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [toggle, setToggle] = useState('email');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isRedirectingRef = useRef(false);

    const theme = useTheme();
    const {isLoading, isFail, isSuccess, message, data} = useSelector(
        (state: RootState) => state.auth.register
    );

    useEffect(() => {
        if (isFail) {
            toast.error(message || 'Something went wrong');
            dispatch(clean());
        }
    }, [isFail, message, dispatch]);

    useEffect(() => {
        if (isSuccess && !isRedirectingRef.current) {
            isRedirectingRef.current = true;
            
            // Используем requestAnimationFrame для синхронизации с циклом рендеринга браузера
            // Это гарантирует, что React завершит все операции перед навигацией
            let timeoutId: NodeJS.Timeout | null = null;
            let cancelled = false;
            
            const frameId = requestAnimationFrame(() => {
                if (cancelled) return;
                
                // Используем небольшой setTimeout для гарантии завершения всех обновлений
                timeoutId = setTimeout(() => {
                    if (!cancelled) {
                        // Используем window.location.href для полной перезагрузки страницы
                        // Это полностью очищает состояние React и предотвращает ошибки DOM
                        window.location.href = '/auth/login';
                    }
                }, 100); // Задержка 100ms для гарантии завершения всех обновлений
            });
            
            // Cleanup функция для предотвращения навигации, если компонент размонтирован
            return () => {
                cancelled = true;
                cancelAnimationFrame(frameId);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
    }, [isSuccess]);

    // STEPS
    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const step = urlParams.get('step');
    //
    //     if (!step) {
    //         router.push({
    //             pathname: router.pathname,
    //             query: {...router.query, step: 1}
    //         });
    //     }
    //
    //     if (step) setCurrentStep(Number(step));
    //
    // }, [router]);

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .required('First name is required')
                .min(2, 'Minimum 2 characters'),
            last_name: Yup.string()
                .required('Last name is required')
                .min(2, 'Minimum 2 characters'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Minimum 6 characters'),
        }),
        onSubmit: (values: Register) => {
            dispatch(register(values));
        },
    });

    return (
        <Paper
            sx={{
                maxWidth: 700,
                margin: '100px auto 10px',
            }}
        >
            <Typography align={'center'} variant="h3" color="white">
                Registration
            </Typography>

            {/*<Box*/}
            {/*  sx={{*/}
            {/*    border: `1px solid ${theme.palette.primary.light}`,*/}
            {/*    display: "flex",*/}
            {/*    gap: "2px",*/}
            {/*    width: "max-content",*/}
            {/*    borderRadius: "9px",*/}
            {/*    margin: "10px auto 10px",*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Box>*/}
            {/*    <Button*/}
            {/*      onClick={() => {*/}
            {/*        setToggle("phone");*/}
            {/*        router.push("/auth/registration/otp");*/}
            {/*      }}*/}
            {/*      size={"small"}*/}
            {/*      sx={{*/}
            {/*        borderRadius: "8px",*/}
            {/*        padding: "8px 10px",*/}
            {/*        backgroundColor: (theme) =>*/}
            {/*          toggle === "phone"*/}
            {/*            ? theme.palette.primary.light*/}
            {/*            : "transparent",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <Typography*/}
            {/*        component={"label"}*/}
            {/*        color={"white"}*/}
            {/*        variant={"subtitle1"}*/}
            {/*        fontWeight={600}*/}
            {/*      >*/}
            {/*        Phone*/}
            {/*      </Typography>*/}
            {/*    </Button>*/}
            {/*  </Box>*/}

            {/*  <Box>*/}
            {/*    <Button*/}
            {/*      onClick={() => {*/}
            {/*        setToggle("email");*/}
            {/*        router.push("/auth/registration");*/}
            {/*      }}*/}
            {/*      size={"small"}*/}
            {/*      sx={{*/}
            {/*        borderRadius: "8px",*/}
            {/*        padding: "8px 10px",*/}
            {/*        backgroundColor: (theme) =>*/}
            {/*          toggle === "email"*/}
            {/*            ? theme.palette.primary.light*/}
            {/*            : "transparent",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <Typography*/}
            {/*        component={"label"}*/}
            {/*        color={"white"}*/}
            {/*        variant={"subtitle1"}*/}
            {/*        fontWeight={600}*/}
            {/*      >*/}
            {/*        Email*/}
            {/*      </Typography>*/}
            {/*    </Button>*/}
            {/*  </Box>*/}
            {/*</Box>*/}

            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        maxWidth: 300,
                        margin: 'auto',
                    }}
                >
                    <Box sx={{display: 'flex', gap: 1}}>
                        <TextField
                            sx={{flex: 1}}
                            placeholder="First Name"
                            variant="outlined"
                            required
                            margin="dense"
                            type="text"
                            name="first_name"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.first_name && Boolean(formik.errors.first_name)
                            }
                            helperText={
                                formik.touched.first_name
                                    ? (formik.errors.first_name as string)
                                    : undefined
                            }
                        />

                        <TextField
                            sx={{flex: 1}}
                            placeholder="Last Name"
                            variant="outlined"
                            required
                            margin="dense"
                            type="text"
                            name="last_name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                            helperText={
                                formik.touched.last_name
                                    ? (formik.errors.last_name as string)
                                    : undefined
                            }
                        />
                    </Box>

                    <TextField
                        sx={{width: '100%'}}
                        placeholder="Email"
                        variant="outlined"
                        required
                        margin="dense"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={
                            formik.touched.email ? (formik.errors.email as string) : undefined
                        }
                    />
                    <Box
                        flex={1}
                        display={'flex'}
                        position={'relative'}
                    >
                        <TextField
                            sx={{width: '100%'}}
                            placeholder="Password"
                            variant="outlined"
                            required
                            margin="dense"
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={
                                formik.touched.password
                                    ? (formik.errors.password as string)
                                    : undefined
                            }
                        />
                        <ShowAndHidePassword
                            isVisible={isPasswordVisible}
                            setIsVisible={setIsPasswordVisible}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        disabled={isLoading}
                        sx={{
                            mt: 1,
                            width: '100%',
                            background: (theme) => theme.palette.background.paper,
                            color: (theme) => theme.palette.text.primary,
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress
                                size={24}
                                sx={{color: (theme) => theme.palette.text.primary}}
                            />
                        ) : (
                            'Register'
                        )}
                    </Button>
                </Box>
            </form>

            <Typography
                onClick={() => router.push('/auth/login')}
                sx={{cursor: 'pointer'}}
                fontWeight={400}
                margin={'10px auto'}
                align={'center'}
                variant="body2"
                color="text.secondary"
            >
                I have already registered
            </Typography>
        </Paper>
    );
};

export default Registration;

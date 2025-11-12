import {useEffect, useState, useRef} from 'react';

import {
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {Box} from '@mui/system';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import useAppDispatch from '@/hooks/useAppDispatch';
import {LogIn as LogInType} from '@/interfaces';
import {RootState} from '@/redux';
import {clean, getCurrentUser, login} from '@/redux/actions/auth';

import ShowAndHidePassword from './components/ShowAndHidePassword';

const LogIn = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isRedirectingRef = useRef(false);

    // Форма состояния без formik
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const {isLoading, isFail, isSuccess, message} = useSelector(
        (state: RootState) => state.auth.login
    );

    useEffect(() => {
        if (isFail) {
            toast.error(message || 'Login failed');
            dispatch(clean());
        }
    }, [isFail, message, dispatch]);

    // Сброс флага редиректа при размонтировании компонента
    useEffect(() => {
        return () => {
            isRedirectingRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (isSuccess && !isRedirectingRef.current) {
            isRedirectingRef.current = true;
            
            // Загружаем данные пользователя после успешного входа
            const loadUserAndRedirect = async () => {
                try {
                    // Небольшая задержка перед getCurrentUser, чтобы токен успел установиться в cookie
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    await dispatch(getCurrentUser()).unwrap();
                    
                    // Используем немедленную навигацию через window.location.href
                    // Это полностью перезагружает страницу и предотвращает любые конфликты с React DOM
                    window.location.href = '/';
                } catch (error) {
                    console.error('Failed to load user:', error);
                    isRedirectingRef.current = false; // Сбрасываем флаг при ошибке
                }
            };
            
            loadUserAndRedirect();
        }
    }, [isSuccess, dispatch]);

    // Валидация полей
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'email':
                if (!value) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Invalid email';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Minimum 6 characters';
                return '';
            default:
                return '';
        }
    };

    // Обработчик изменения полей
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        
        // Валидация при изменении, если поле было затронуто
        if (touched[name as keyof typeof touched]) {
            const error = validateField(name, value);
            setErrors(prev => ({...prev, [name]: error}));
        }
    };

    // Обработчик blur (когда поле теряет фокус)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setTouched(prev => ({...prev, [name]: true}));
        const error = validateField(name, value);
        setErrors(prev => ({...prev, [name]: error}));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Помечаем все поля как затронутые
        const allTouched = {
            email: true,
            password: true,
        };
        setTouched(allTouched);

        // Валидация всех полей
        const newErrors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };
        setErrors(newErrors);

        // Проверяем, есть ли ошибки
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        
        if (!hasErrors) {
            // Отправляем данные на вход
            try {
                await dispatch(login(formData as LogInType)).unwrap();
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    };

    // Если вход успешен, не рендерим форму
    if (isSuccess) {
        return null;
    }

    return (
        <Paper
            sx={{
                maxWidth: 700,
                margin: '100px auto 10px',
            }}
        >
            <Typography align={'center'} variant="h1" color="white">
                Login
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
            {/*        router.push("/auth/login/otp");*/}
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
            {/*        router.push("/auth/login");*/}
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

            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        maxWidth: 300,
                        margin: '10px auto 0',
                    }}
                >
                    <TextField
                        sx={{
                            width: '100%',
                        }}
                        placeholder={'Email'}
                        fullWidth
                        variant="outlined"
                        required
                        margin="dense"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email ? errors.email : undefined}
                    />

                    <Box
                        flex={1}
                        display={'flex'}
                        position={'relative'}
                    >
                        <TextField
                            sx={{
                                width: '100%',
                            }}
                            placeholder={'Password'}
                            fullWidth
                            variant="outlined"
                            required
                            margin="dense"
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password ? errors.password : undefined}
                        />
                        <ShowAndHidePassword
                            isVisible={isPasswordVisible}
                            setIsVisible={setIsPasswordVisible}
                        />
                    </Box>
                    <Typography
                        onClick={() => router.push('/auth/recover')}
                        sx={{cursor: 'pointer'}}
                        fontWeight={400}
                        margin={'10px auto'}
                        align={'right'}
                        variant="body2"
                        color="text.secondary"
                    >
                        Forgot your password?
                    </Typography>

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
                            'Login'
                        )}
                    </Button>
                </Box>
            </form>

            <Typography
                onClick={() => router.push('/auth/registration')}
                sx={{cursor: 'pointer'}}
                fontWeight={400}
                margin={'10px auto'}
                align={'center'}
                variant="body2"
                color="text.secondary"
            >
                I don't have an account, register
            </Typography>
        </Paper>
    );
};

export default LogIn;

import {useEffect, useLayoutEffect, useState, useRef} from 'react';
import React from 'react';

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

import useAppDispatch from '@/hooks/useAppDispatch';
import {Register} from '@/interfaces';
import {RootState} from '@/redux';
import {clean, register} from '@/redux/actions/auth';

import ShowAndHidePassword from '../LogIn/components/ShowAndHidePassword';

const Registration = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isRedirectingRef = useRef(false);

    // Форма состояния без formik
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [touched, setTouched] = useState({
        first_name: false,
        last_name: false,
        email: false,
        password: false,
    });

    const {isLoading, isFail, isSuccess, message} = useSelector(
        (state: RootState) => state.auth.register
    );

    // Устанавливаем флаг навигации сразу при успешной регистрации
    // Это предотвращает любые обновления DOM до навигации
    if (isSuccess && !isRedirectingRef.current) {
        isRedirectingRef.current = true;
    }

    useEffect(() => {
        if (isFail) {
            // Убрали toast, чтобы избежать ошибок removeChild
            dispatch(clean());
        }
    }, [isFail, message, dispatch]);

    // Сброс флага редиректа при размонтировании компонента
    useEffect(() => {
        return () => {
            isRedirectingRef.current = false;
        };
    }, []);

    // Используем useLayoutEffect для синхронной навигации ДО того, как браузер отрисует изменения
    // Это предотвращает любые попытки React обновить DOM во время навигации
    useLayoutEffect(() => {
        if (isSuccess && isRedirectingRef.current) {
            // Немедленная навигация через window.location.href
            // Это полностью перезагружает страницу и предотвращает любые конфликты с React DOM
            window.location.href = '/auth/login';
        }
    }, [isSuccess]);

    // Валидация полей
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'first_name':
                if (!value) return 'First name is required';
                if (value.length < 2) return 'Minimum 2 characters';
                return '';
            case 'last_name':
                if (!value) return 'Last name is required';
                if (value.length < 2) return 'Minimum 2 characters';
                return '';
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
        // Предотвращаем обновления после начала навигации
        if (isRedirectingRef.current) return;
        
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
        // Предотвращаем обновления после начала навигации
        if (isRedirectingRef.current) return;
        
        const {name, value} = e.target;
        setTouched(prev => ({...prev, [name]: true}));
        const error = validateField(name, value);
        setErrors(prev => ({...prev, [name]: error}));
    };

    // Обработчик отправки формы
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Предотвращаем отправку после начала навигации
        if (isRedirectingRef.current) return;
        
        // Помечаем все поля как затронутые
        const allTouched = {
            first_name: true,
            last_name: true,
            email: true,
            password: true,
        };
        setTouched(allTouched);

        // Валидация всех полей
        const newErrors = {
            first_name: validateField('first_name', formData.first_name),
            last_name: validateField('last_name', formData.last_name),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };
        setErrors(newErrors);

        // Проверяем, есть ли ошибки
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        
        if (!hasErrors) {
            // Отправляем данные на регистрацию
            dispatch(register(formData as Register));
        }
    };

    // Если регистрация успешна или начата навигация, не рендерим форму
    // Это должно быть ДО всех хуков, но мы не можем так сделать из-за правил хуков
    // Поэтому проверяем в начале рендера
    if (isSuccess || isRedirectingRef.current) {
        return null;
    }

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

            <form onSubmit={handleSubmit}>
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
                            value={formData.first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.first_name && Boolean(errors.first_name)}
                            helperText={
                                touched.first_name ? errors.first_name : undefined
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
                            value={formData.last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.last_name && Boolean(errors.last_name)}
                            helperText={
                                touched.last_name ? errors.last_name : undefined
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
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={
                            touched.email ? errors.email : undefined
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
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={
                                touched.password ? errors.password : undefined
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

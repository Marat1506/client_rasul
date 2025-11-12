import { useEffect, useState, useRef } from 'react';

import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import useAppDispatch from '@/hooks/useAppDispatch';
import { LogIn as LogInType } from '@/interfaces';
import { RootState } from '@/redux';
import { clean, login } from '@/redux/actions/auth';

import ShowAndHidePassword from '../components/ShowAndHidePassword';

const LogIn = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, isFail, isSuccess, message } = useSelector(
    (state: RootState) => state.auth.login
  );
  const [toggle, setToggle] = useState('phone');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const theme = useTheme();
  const isRedirectingRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationFrameRef = useRef<number | null>(null);

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string().required('Phone is required'),
      password: Yup.string()
          .required('Password is required')
          .min(6, 'Minimum 6 characters'),
    }),
    onSubmit: (values: LogInType) => {
      dispatch(login(values));
    },
  });

  useEffect(() => {
    if (isFail) {
      toast.error(message);
      dispatch(clean());
    }
  }, [isFail, message, dispatch]);

  useEffect(() => {
    if (isSuccess && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      toast.success(message);
      formik.resetForm();
      
      // Используем requestAnimationFrame и setTimeout для отложенной навигации
      // Это предотвращает ошибки removeChild при размонтировании компонентов
      navigationFrameRef.current = requestAnimationFrame(() => {
        navigationTimeoutRef.current = setTimeout(() => {
          // Используем window.location.href для полной перезагрузки страницы
          // Это полностью очищает состояние React и предотвращает ошибки DOM
          window.location.href = '/';
        }, 100); // Задержка 100ms для гарантии завершения всех обновлений
      });
      
      // Cleanup функция для предотвращения навигации, если компонент размонтирован
      return () => {
        if (navigationFrameRef.current !== null) {
          cancelAnimationFrame(navigationFrameRef.current);
          navigationFrameRef.current = null;
        }
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
          navigationTimeoutRef.current = null;
        }
      };
    }
  }, [isSuccess, message, formik]);

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

      <Box
        sx={{
          border: `1px solid ${theme.palette.primary.light}`,
          display: 'flex',
          gap: '2px',
          width: 'max-content',
          borderRadius: '9px',
          margin: '10px auto 10px',
        }}
      >
        <Box>
          <Button
            onClick={() => {
              setToggle('phone');
              router.push('/auth/login/otp');
            }}
            size={'small'}
            sx={{
              borderRadius: '8px',
              padding: '8px 10px',
              backgroundColor: (theme) =>
                toggle === 'phone'
                  ? theme.palette.primary.light
                  : 'transparent',
            }}
          >
            <Typography
              component={'label'}
              color={'white'}
              variant={'subtitle1'}
              fontWeight={600}
            >
              Phone
            </Typography>
          </Button>
        </Box>

        <Box>
          <Button
            onClick={() => {
              setToggle('email');
              router.push('/auth/login');
            }}
            size={'small'}
            sx={{
              borderRadius: '8px',
              padding: '8px 10px',
              backgroundColor: (theme) =>
                toggle === 'email'
                  ? theme.palette.primary.light
                  : 'transparent',
            }}
          >
            <Typography
              component={'label'}
              color={'white'}
              variant={'subtitle1'}
              fontWeight={600}
            >
              Email
            </Typography>
          </Button>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
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
            placeholder={'Phone'}
            fullWidth
            variant="outlined"
            required
            margin="dense"
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone ? formik.errors.phone : undefined}
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
              placeholder={'Passowrd'}
              fullWidth
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
                formik.touched.password ? formik.errors.password : undefined
              }
            />
            <ShowAndHidePassword
              isVisible={isPasswordVisible}
              setIsVisible={setIsPasswordVisible}
            />
          </Box>
          <Typography
            onClick={() => router.push('/auth/recover')}
            sx={{ cursor: 'pointer' }}
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
                sx={{ color: (theme) => theme.palette.text.primary }}
              />
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </form>

      <Typography
        onClick={() => router.push('/auth/registration/otp')}
        sx={{ cursor: 'pointer' }}
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

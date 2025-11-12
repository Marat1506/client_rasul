import { useState } from 'react';

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
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import useAppDispatch from '@/hooks/useAppDispatch';
import { login, otp } from '@/redux/actions/auth';

import Api from '../../../../services';
import ShowAndHidePassword from '../../LogIn/components/ShowAndHidePassword';

const Phone = ({ ...props }) => {
  const { setOtp, setPhone } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState('phone');
  const theme = useTheme();

  const formik = useFormik({
    initialValues: { 
      phone: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string().required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const data: any = await Api.getOtpByPhone(values.phone);

        if (data.status === 201 || data.status === 200) {
          toast.success(
            data.message ||
              'Enter the four digit code sent to your mobile number'
          );
          setOtp(true);
          setPhone(values.phone);
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Paper
      sx={{
        maxWidth: 400,
        padding: 4,
        margin: '100px auto 10px',
      }}
    >
      <Typography align={'center'} variant="h4" color="white">
        Enter Your Phone Number
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
              router.push('/auth/registration/otp');
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
              router.push('/auth/registration');
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
        <Box sx={{ maxWidth: 300, margin: 'auto' }}>
          <TextField
            sx={{ width: '100%', mt: 2 }}
            placeholder="Phone Number"
            fullWidth
            variant="outlined"
            margin="dense"
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone ? formik.errors.phone : ''}
          />

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
            {isLoading ? <CircularProgress size={24} /> : 'Send code'}
          </Button>
        </Box>
      </form>

      <Typography
        onClick={() => router.push('/auth/login')}
        sx={{ cursor: 'pointer', mt: 2 }}
        align="center"
        variant="body2"
        color="text.secondary"
      >
        I have already registered
      </Typography>
    </Paper>
  );
};

const Otp = ({ ...props }) => {
  const { phone } = props;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string().required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      try {
        const data: any = await Api.verifyByPhone({ otp: values.otp, phone });
        if (data.status === 201 || data.status === 200) {
          toast.success(data.data.message || 'Code is correct');
          dispatch(otp(data.data.user));
          formik.resetForm();
          setTimeout(() => {
            props.setOptCode(String(values.otp));
            props.setIsChangePassword(true);
            setIsLoading(false);
          }, 1000);
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Something went wrong');
        setIsLoading(false);
      } finally {
      }
    },
  });

  return (
    <Paper
      sx={{
        maxWidth: 400,
        padding: 4,
        margin: '100px auto 10px',
      }}
    >
      <Typography align={'center'} variant="h6" color="white">
        Please enter the One-Time code to verify your account
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ maxWidth: 300, margin: 'auto' }}>
          <TextField
            sx={{ width: '100%', mt: 2 }}
            placeholder="One-Time Code"
            fullWidth
            variant="outlined"
            margin="dense"
            type="tel"
            name="otp"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.otp && Boolean(formik.errors.otp)}
            helperText={formik.touched.otp ? formik.errors.otp : ''}
          />

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
            {isLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const ChangePassword = ({ optCode, phone }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      try {
        const data: any = await Api.changePassword({
          oldPassword: optCode,
          newPassword: values.password,
        });
        if (data.status === 201 || data.status === 200) {
          toast.success(data.data.message || 'password created');
          formik.resetForm();
          setTimeout(() => {
            dispatch(login({ phone, password: values.password }));
          }, 1000);
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <Paper
      sx={{
        maxWidth: 400,
        padding: 4,
        margin: '100px auto 10px',
      }}
    >
      <Typography align={'center'} variant="h6" color="white">
        Please create a password to log in further
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ maxWidth: 300, margin: 'auto' }}>
          <Box
            flex={1}
            display={'flex'}
            position={'relative'}
          >
            <TextField
              sx={{ width: '100%', mt: 2 }}
              placeholder="Password"
              fullWidth
              variant="outlined"
              margin="dense"
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password ? formik.errors.password : ''}
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
            {isLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const PhoneVerification = () => {
  const [isOtp, setOtp] = useState(false);
  const [phone, setPhone] = useState('');
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [optCode, setOptCode] = useState('');
  return (
    <Box>
      {isOtp ? (
        isChangePassword ? (
          <ChangePassword optCode={optCode} phone={phone} />
        ) : (
          <Otp
            phone={phone}
            setIsChangePassword={setIsChangePassword}
            setOptCode={setOptCode}
          />
        )
      ) : (
        <Phone setOtp={setOtp} setPhone={setPhone} />
      )}
    </Box>
  );
};

export default PhoneVerification;

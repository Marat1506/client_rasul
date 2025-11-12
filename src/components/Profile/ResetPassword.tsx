import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import Api from '../../services';

const ResetPassword = () => {
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (values) => {
            try {
                const { data } = await Api.resetPassword(values.password);
                toast.success(data.message);
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    return (
        <Box>
            <Typography
                mt="50px"
                mb="20px"
                variant="h3"
                fontWeight={700}
                color="text.primary"
            >
                Reset Password
            </Typography>
            <form>
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={12} sm={6} margin={'auto'}>
                        <TextField
                            sx={{
                                '& div': {
                                    backgroundColor: (theme: any) =>
                                        theme.palette.background.paper,
                                    color: (theme: any) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme: any) => theme.palette.secondary.dark,
                                },
                            }}
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} margin={'auto'}>
                        <TextField
                            sx={{
                                '& div': {
                                    backgroundColor: (theme: any) =>
                                        theme.palette.background.paper,
                                    color: (theme: any) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme: any) => theme.palette.secondary.dark,
                                },
                            }}
                            fullWidth
                            label="Confirm Password"
                            variant="outlined"
                            type="password" 
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="end" alignItems={'center'} gap={2}>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            formik.handleSubmit();
                        }}
                        variant="contained"
                        size="large"
                        sx={{
                            height: 50,
                            mt: 2,
                            background: (theme) => theme.palette.primary.main,
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ResetPassword;
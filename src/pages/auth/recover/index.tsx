import React from 'react';

import {Button, Paper, TextField, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useFormik} from 'formik';
import {toast} from 'react-toastify';
import * as Yup from 'yup';

import Api from '@/services';

const Recover = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Email is required'),
        }),
        onSubmit: async (values) => {
            try {
                await Api.forgot_password(values.email);
                toast.success('Password reset instructions have been sent to your email');
            } catch (error: any) {
                console.error('Password reset error:', error);

                if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else if (error.request && error.request.responseText) {
                    try {
                        const errorData = JSON.parse(error.request.responseText);
                        toast.error(errorData.message || 'Failed to send reset email');
                    } catch (parseError) {
                        toast.error('Failed to send reset email');
                    }
                } else if (error.message) {
                    toast.error(error.message);
                } else {
                    toast.error('Network error. Please try again.');
                }
            }
        },
    });

    return (
        <Paper
            sx={{
                maxWidth: 700,
                margin: '100px auto 10px',
                padding: 3,
            }}
        >
            <Typography align={'center'} variant="h2" color="white" gutterBottom>
                Password Recovery
            </Typography>

            <Typography
                fontWeight={400}
                maxWidth={400}
                margin={'10px auto'}
                align={'center'}
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
            >
                Enter your email address and we will send you password reset instructions.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{
                    maxWidth: 300,
                    margin: 'auto'
                }}>
                    <TextField
                        sx={{
                            width: '100%',
                            marginBottom: 2
                        }}
                        placeholder={'Email'}
                        fullWidth
                        variant="outlined"
                        required
                        margin="dense"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <Button
                        type="submit"
                        variant={'contained'}
                        size={'large'}
                        sx={{
                            mt: 1,
                            width: '100%',
                            background: (theme) => theme.palette.primary.dark,
                        }}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default Recover;
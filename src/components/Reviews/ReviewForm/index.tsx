import React from 'react';

import {
    Button,
    TextField,
    Typography,
    FormHelperText,
    Stack, Rating,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useFormik, Form, FormikProvider} from 'formik';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import * as Yup from 'yup';

import {RootState} from '@/redux';

import Api from '../../../services';

const RootStyle = styled('div')(({theme}) => ({
    margin: theme.spacing(1),
    [theme.breakpoints.up(898)]: {
        marginLeft: theme.spacing(3),
    },
    borderRadius: '8px',
    backgroundColor: theme.palette.background.default
}));

ProductDetailsReviewForm.propTypes = {
    onClose: PropTypes.func 
};

export default function ProductDetailsReviewForm({...props}) {
    const {onAddingReview} = props;
    const router = useRouter();
    const {isAuthorization, user} = useSelector((state: RootState) => state.auth);

    const ReviewSchema = Yup.object().shape({
        rating: Yup.mixed().required('Rating is required'),
        review: Yup.string().required('Review is required')
    });

    const formik = useFormik({
        initialValues: {
            rating: null,
            review: '',
        },
        validationSchema: ReviewSchema,
        onSubmit: async (values) => {
            if (isAuthorization) {
                const review = {
                    rating: values.rating,
                    comment: values.review, // Бэкенд ожидает 'comment', а не 'review'
                    user_name: user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : user?.email || 'Пользователь',
                };

                try {
                    const {data} = await Api.addReview(review);
                    // Преобразуем данные для совместимости с компонентом отображения
                    const reviewData = {
                        ...data.data,
                        review: data.data.comment, // Компонент ReviewsList ожидает поле 'review'
                        date_created: data.data.created_at, // Компонент ожидает 'date_created'
                    };
                    onAddingReview(reviewData);
                    toast.success('Review created');
                    formik.resetForm();
                } catch (e: any) {
                    console.error(e);
                    const errorMessage = e.response?.data?.message || e.message || 'Ошибка при создании отзыва';
                    toast.error(errorMessage);
                }

            } else {
                router.push('/auth/login');
            }
        }
    });

    const {
        values,
        errors,
        touched,
        resetForm,
        handleSubmit,
        setFieldValue,
        getFieldProps
    } = formik;

    const onCancel = () => {
        resetForm();
    };

    return (
        <RootStyle >
            <Typography variant="subtitle1" gutterBottom>
                {'Add review'}
            </Typography>

            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Stack
                            direction={{xs: 'column', sm: 'row'}}
                            alignItems={{sm: 'center'}}
                            spacing={1.5}>
                            <Typography variant="body2">Your review about</Typography>
                            <Rating
                                {...getFieldProps('rating')}
                                onChange={(event: any) =>
                                    setFieldValue('rating', Number(event.target.value))
                                }
                            />
                        </Stack>
                        {errors.rating && (
                            <FormHelperText error>
                                {touched.rating && 'rating-required'}
                            </FormHelperText>
                        )}

                        <TextField
                            sx={{
                                'div': {
                                    backgroundColor: (theme: any) => theme.palette.background.default,
                                    color: (theme) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme) => theme.palette.grey[500],
                                    opacity: 1,
                                },
                                mt: 2
                            }}
                            fullWidth
                            multiline
                            minRows={3}
                            variant="outlined"
                            maxRows={5}
                            label={'Review'}
                            {...getFieldProps('review')}
                            error={Boolean(touched.review && errors.review)}
                            helperText={touched.review && 'Review error'}
                        />

                        <Stack direction="row" justifyContent="flex-end">
                            <Button
                                type="button"
                                color="inherit"
                                variant="outlined"
                                onClick={onCancel}
                                sx={{mr: 1.5}}>
                                cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                // loading={isLoading}
                            >
                                Post review
                            </Button>
                        </Stack>
                    </Stack>
                </Form>
            </FormikProvider>
        </RootStyle>
    );
}

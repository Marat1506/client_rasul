import React, {useEffect} from 'react';

import {
    Button,
    Grid,
    Paper,
    Skeleton,
    Typography,
    Select,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Box,
    IconButton
} from '@mui/material';
import axios from 'axios';
import {useFormik} from 'formik';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import * as Yup from 'yup';

import useAppDispatch from '@/hooks/useAppDispatch';
import config from '@/layout/config.json';
import {RootState} from '@/redux';
import {leaveRequest} from '@/redux/actions/contents';
import {leads} from '@/redux/actions/pages';
import http from '@/services/http';

import styles from './ContactForm.module.scss';
import {
    CompleteIcon,
    DogIcon,
    PhoneIcon,
    SendContainedIcon,
    UploadIcon
} from '../../../../public/svg';

import request_bg from '@/../public/images/request_bg.svg';


const countries = [
    {code: '+971', flag: '🇦🇪', name: 'United Arab Emirates'},
    {code: '+1', flag: '🇺🇸', name: 'United States'},
    {code: '+44', flag: '🇬🇧', name: 'United Kingdom'},
    {code: '+61', flag: '🇦🇺', name: 'Australia'},
    {code: '+33', flag: '🇫🇷', name: 'France'},
    {code: '+49', flag: '🇩🇪', name: 'Germany'},
    {code: '+81', flag: '🇯🇵', name: 'Japan'},
    {code: '+7', flag: '🇷🇺', name: 'Russia'},
    {code: '+86', flag: '🇨🇳', name: 'China'},
    {code: '+91', flag: '🇮🇳', name: 'India'},
    {code: '+55', flag: '🇧🇷', name: 'Brazil'},
    {code: '+374', flag: '🇦🇲', name: 'Armenia'},
    {code: '+33', flag: '🇫🇷', name: 'France'},
    {code: '+81', flag: '🇯🇵', name: 'Japan'},
    {code: '+995', flag: '🇬🇪', name: 'Georgia'},
    {code: '+90', flag: '🇹🇷', name: 'Turkey'},
    {code: '+98', flag: '🇮🇷', name: 'Iran'},
    {code: '+91', flag: '🇮🇳', name: 'India'},
    {code: '+82', flag: '🇰🇷', name: 'South Korea'}
];

const inputStyles = {
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    background: 'transparent',
    color: 'white',
};

const detectCountryByPhoneLength = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length === 8) return '+374';
    else if (digitsOnly.length === 9) return '+971';
    else if (digitsOnly.length === 10) return '+1';
    return '+1';
};

const ContactForm = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data, isLoading} = useSelector(
        (store: RootState) => store.contents.leaveRequest
    );
    const [isSend, setIsSend] = React.useState(false);
    const [countryCode, setCountryCode] = React.useState('+1');
    const [uploadedImages, setUploadedImages] = React.useState<Array<{ url: string, _id: string }>>([]);
    const [uploadProgress, setUploadProgress] = React.useState<{ [key: string]: number }>({});
    const [previews, setPreviews] = React.useState<string[]>([]);
    const [autoDetectedCountry, setAutoDetectedCountry] = React.useState(false);

    const {
        isLoading: isLoadingLeads,
        isFail,
        isSuccess,
        message,
        data: dataLeads,
    } = useSelector((store: RootState) => store.pages.leads);

    const {user, isAuthorization} = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (user) {
            formik.setFieldValue('name', user.firstName || '');
            formik.setFieldValue('email', user.email || '');

            if (user.phone) {
                const matchedCountry = countries.find(country =>
                    user.phone.startsWith(country.code)
                );

                if (matchedCountry) {
                    setCountryCode(matchedCountry.code);
                    const phoneWithoutCode = user.phone.replace(matchedCountry.code, '');
                    formik.setFieldValue('phone', phoneWithoutCode);
                    setAutoDetectedCountry(false);
                } else {
                    const detectedCode = detectCountryByPhoneLength(user.phone);
                    setCountryCode(detectedCode);
                    const cleanedPhone = user.phone.replace(/^\+|^00/, '');
                    const codeDigits = detectedCode.replace('+', '');
                    const phoneWithoutCode = cleanedPhone.startsWith(codeDigits)
                        ? cleanedPhone.substring(codeDigits.length)
                        : cleanedPhone;
                    formik.setFieldValue('phone', phoneWithoutCode);
                    setAutoDetectedCountry(true);
                }
            } else {
                formik.setFieldValue('phone', '');
            }
        }
    }, [user]);

    useEffect(() => {
        dispatch(leaveRequest());
    }, []);

    useEffect(() => {
        if (isFail) {
            toast.error(message);
            setIsSend(false);
        }
        if (isSuccess) {
            toast.success(message);
            setUploadedImages([]);
            setPreviews([]);
            formik.resetForm();
        }
    }, [isFail, isSuccess]);

    const getMaxPhoneLength = (code: string) => {
        switch (code) {
            case '+374':
                return 8;
            case '+971':
                return 9;
            case '+1':
                return 10;
            case '+44':
                return 10;
            case '+7':
                return 10;
            case '+33':
                return 9;
            case '+49':
                return 10;
            case '+81':
                return 10;
            case '+86':
                return 11;
            case '+91':
                return 10;
            case '+55':
                return 11;
            default:
                return 15;
        }
    };

    const generateObjectId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const handleFileUpload = async (file: File) => {
        const fileId = generateObjectId();
        setUploadProgress(prev => ({...prev, [fileId]: 0}));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my-uploads');

        try {
            const response = await http.post('/api/v1/users/files', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(prev => ({...prev, [fileId]: percentCompleted}));
                    }
                }
            });

            // Бекенд возвращает { data: { url: ... } }, поэтому URL находится в response.data.data.url
            const imageUrl = response.data?.data?.url || response.data?.url;

            if (!imageUrl) {
                console.error('No URL in response!');
                throw new Error('No URL returned from server');
            }

            const newImage = {
                _id: generateObjectId(),
                url: imageUrl
            };

            setUploadedImages(prev => [...prev, newImage]);
            return newImage;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        } finally {
            setUploadProgress(prev => {
                const newProgress = {...prev};
                delete newProgress[fileId];
                return newProgress;
            });
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).slice(0, 5 - uploadedImages.length);

            const newPreviews = newFiles.map(file => {
                return URL.createObjectURL(file);
            });
            setPreviews(prev => [...prev, ...newPreviews]);

            await Promise.all(newFiles.map(file => handleFileUpload(file)));
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...uploadedImages];
        const newPreviews = [...previews];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setUploadedImages(newImages);
        setPreviews(newPreviews);
        URL.revokeObjectURL(previews[index]);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string()
                .required('Phone is required')
                .test('phone-length', 'Invalid phone length', function (value) {
                    const maxLength = getMaxPhoneLength(countryCode);
                    return value ? value.length === maxLength : false;
                }),
            email: Yup.string().email('Invalid email').required('Email is required'),
            message: Yup.string().required('Enter a message'),
        }),
        onSubmit: async (values) => {
            setIsSend(true);

            // Фильтруем изображения, убирая пустые URL
            const validImages = uploadedImages
                .map(item => item?.url)
                .filter(url => url && url.trim() !== '');

            const data: any = {
                ...values,
                phone: countryCode + values.phone,
            };

            // Добавляем images только если есть валидные изображения
            if (validImages.length > 0) {
                data.images = validImages;
            }

            dispatch(leads(data))
                .then((result) => {
                    if (result.type.endsWith('/fulfilled')) {
                        toast.success('Request sent successfully!');
                        setUploadedImages([]);
                        setPreviews([]);
                        formik.resetForm();
                    }
                })
                .catch((error) => {
                    toast.error('Failed to send request');
                })
                .finally(() => {
                    setIsSend(false);
                });
        },
    });

    return (
        <Paper
            sx={{
                flex: 1,
                backgroundImage: `url(${request_bg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: 3,
                position: 'relative'
            }}
        >
            <Typography variant="h3" color="white" fontWeight={400}>
                Submit a request
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={400}>
                You can also contact us:
            </Typography>

            <Box className={styles.contact}>
                <Typography
                    className={styles.info}
                    variant="body1"
                    color="text.secondary"
                    fontWeight={400}
                >
                    <DogIcon/> email:
                    <Typography
                        component={'span'}
                        display={'inline-block'}
                        variant="body1"
                        color="white"
                        fontWeight={600}
                    >
                        {config.company.email}
                    </Typography>
                </Typography>

                <Typography
                    className={styles.info}
                    variant="body1"
                    color="text.secondary"
                    fontWeight={400}
                >
                    <PhoneIcon/> Phone:
                    <Typography
                        component={'span'}
                        display={'inline-block'}
                        variant="body1"
                        color="white"
                        fontWeight={600}
                    >
                        {config.company.phone}
                    </Typography>
                </Typography>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    height: 'calc(100% - 118px)',
                    mt: 2.5,
                    borderRadius: 1,
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={6} md={4}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel
                                    htmlFor="name"
                                    sx={{
                                        color: 'text.secondary',
                                        '&.Mui-focused': {
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Name*
                                </InputLabel>
                                <OutlinedInput
                                    id="name"
                                    name="name"
                                    label="Name*"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    sx={{
                                        ...inputStyles,
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'text.secondary'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white'
                                        }
                                    }}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.name}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} md={4}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel
                                    htmlFor="email"
                                    sx={{
                                        color: 'text.secondary',
                                        '&.Mui-focused': {
                                            color: 'white'
                                        }
                                    }}
                                >
                                    E-mail*
                                </InputLabel>
                                <OutlinedInput
                                    id="email"
                                    name="email"
                                    label="E-mail*"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    sx={{
                                        ...inputStyles,
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'text.secondary'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white'
                                        }
                                    }}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.email}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel
                                    htmlFor="phone"
                                    sx={{
                                        color: 'text.secondary',
                                        '&.Mui-focused': {
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Phone*
                                </InputLabel>
                                <OutlinedInput
                                    id="phone"
                                    name="phone"
                                    label="Phone*"
                                    value={formik.values.phone}
                                    onChange={(e) => {
                                        const numericValue = e.target.value.replace(/\D/g, '');
                                        const maxLength = getMaxPhoneLength(countryCode);
                                        if (numericValue.length <= maxLength) {
                                            formik.setFieldValue('phone', numericValue);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    inputProps={{
                                        maxLength: getMaxPhoneLength(countryCode),
                                        inputMode: 'numeric',
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Select
                                                value={countryCode}
                                                onChange={(e) => {
                                                    setCountryCode(e.target.value);
                                                    formik.setFieldValue('phone', '');
                                                    setAutoDetectedCountry(false);
                                                }}
                                                sx={{
                                                    ...inputStyles,
                                                    '& .MuiSelect-select': {
                                                        padding: '8px 16px 8px 8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: 'white',
                                                    },
                                                    color: 'white',
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        sx: {
                                                            bgcolor: '#424242',
                                                            '& .MuiMenuItem-root': {
                                                                fontSize: '1rem',
                                                                padding: '8px 16px',
                                                                gap: '8px',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            >
                                                {countries.map((country) => (
                                                    <MenuItem
                                                        key={country.code}
                                                        value={country.code}
                                                        sx={{
                                                            color: 'white',
                                                            '&:hover': {
                                                                color: 'white',
                                                            },
                                                        }}
                                                    >
                                                        <span style={{fontSize: '1.2em'}}>{country.flag}</span>
                                                        <Typography color="white"
                                                                    sx={{ml: 1}}>{country.code}</Typography>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </InputAdornment>
                                    }
                                    sx={{
                                        ...inputStyles,
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'text.secondary'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white'
                                        }
                                    }}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.phone}
                                    </Typography>
                                )}
                                {/*{autoDetectedCountry && (*/}
                                {/*    <Typography color="warning.main" variant="caption">*/}
                                {/*        Country code detected automatically. Please verify.*/}
                                {/*    </Typography>*/}
                                {/*)}*/}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} height={200}>
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel
                                    htmlFor="message"
                                    sx={{
                                        ...inputStyles,
                                        color: 'text.secondary',
                                        '&.Mui-focused': {
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Write something...
                                </InputLabel>
                                <OutlinedInput
                                    id="message"
                                    name="message"
                                    label="Write something..."
                                    multiline
                                    rows={4}
                                    value={formik.values.message}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.message && Boolean(formik.errors.message)}
                                    sx={{
                                        ...inputStyles,
                                        color: 'white',
                                        height: '300px',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        '& .MuiOutlinedInput-input': {
                                            paddingTop: '10px',
                                            paddingBottom: '10px'
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'text.secondary'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white'
                                        },
                                        '@media (max-width: 600px)': {
                                            height: '150px'
                                        }
                                    }}
                                />
                                {formik.touched.message && formik.errors.message && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.message}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    {previews.length > 0 && (
                        <Box className={styles.form_images}>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {previews.map((preview, index) => (
                                    <Box key={index} position="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 4,
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '20px',
                                                height: '20px',
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                color: 'white',
                                                background: 'rgba(0,0,0,0.5)',
                                                '&:hover': {
                                                    background: 'rgba(0,0,0,0.7)'
                                                }
                                            }}
                                        >
                                            x
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box className={`${styles.form_buttons} ${previews.length > 0 && styles.unset}`}>
                        {Object.keys(uploadProgress).length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                                Uploading: {Object.values(uploadProgress)[0]}%
                            </Typography>
                        )}
                        <Box display="flex" gap={1}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    style={{display: 'none'}}
                                    id="upload-button"
                                    disabled={uploadedImages.length >= 5 || Object.keys(uploadProgress).length > 0}
                                />
                                <label htmlFor="upload-button">
                                    <Button
                                        component="span"
                                        className={styles.icon_button}
                                        variant="contained"
                                        endIcon={<UploadIcon/>}
                                        disabled={uploadedImages.length >= 5 || Object.keys(uploadProgress).length > 0}
                                        sx={{
                                            background: (theme) => theme.palette.background.paper,
                                            color: (theme) => theme.palette.text.primary,
                                        }}
                                    />
                                </label>
                            </Box>

                            <Button
                                type="submit"
                                variant={'contained'}
                                endIcon={<SendContainedIcon/>}
                                sx={{
                                    background: (theme) => theme.palette.background.paper,
                                    color: (theme) => theme.palette.text.primary,
                                }}
                            >
                                Get a consultation
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Paper>
    );
};

export default ContactForm;
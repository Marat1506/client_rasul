import React, {useState} from 'react';

import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import {Avatar, Box, Typography, CircularProgress} from '@mui/material';
import {useDropzone} from 'react-dropzone';
import {useSelector} from 'react-redux';
import { toast } from 'react-toastify';

import {RootState} from '@/redux';
import http from '@/services/http';
import {getAvatarUrl} from '@/utils/avatar';

import {UloadPencleIcon} from '../../../public/svg';


interface AvatarUploadProps {
    onFileChange: (fileId: string | null) => void;
    loading?: boolean;
    error?: boolean;
    maxSize?: number;
    accept?: string;
    onUploadProgress?: (percentage: number) => void;
    toggle?: string; // Add this to accept the toggle prop
}
 
const AvatarUpload = ({
                          onFileChange,
                          loading = false,
                          error = false,
                          maxSize = 3145728,
                          accept = 'image/*',
                          onUploadProgress,
                          toggle // Destructure it here
                      }: AvatarUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const {user} = useSelector((state: RootState) => state.auth);

    const handleUpload = async (file: File, preview: string) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await http.post('/api/v1/users/files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const {loaded, total} = progressEvent;
                    const percentage = Math.floor((loaded * 100) / total);
                    setUploadProgress(percentage);
                    onUploadProgress?.(percentage);
                },
            });

            const uploadedFile = response.data.data;
            // Используем url вместо id для аватара
            const avatarUrl = uploadedFile.url;
            console.log('Avatar uploaded, URL:', avatarUrl);
            console.log('Calling onFileChange with:', avatarUrl);
            onFileChange(avatarUrl);
            
            // Автоматически сохраняем аватар в профиль после загрузки
            // Это нужно сделать здесь, чтобы не требовать от пользователя нажимать "Save"
            // Но для этого нужен доступ к dispatch, который передадим через пропсы
            
            toast.success('Avatar uploaded successfully!');

        } catch (error: any) {
            console.error('Upload failed', error);

            let errorMessage = 'Upload failed. Please try again later.';

            if (error?.response?.status === 503) {
                errorMessage = 'Server is temporarily unavailable. Please try again later.';
            } else if (error?.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
            onFileChange(null);

            // Clean up preview URL on error
            URL.revokeObjectURL(preview);
            setPreviewUrl(null);
            setFile(null);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const {getRootProps, getInputProps} = useDropzone({
        multiple: false,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxSize: maxSize,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setIsUploading(true);
            setFile(file);

            // Create preview URL
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);

            // Use setTimeout to avoid promise rejection in dropzone handler
            setTimeout(() => {
                handleUpload(file, preview).catch((error) => {
                    // Extra safety catch
                    console.error('Unhandled upload error:', error);
                    toast.error('Upload failed. Please try again.');
                    setIsUploading(false);
                    setUploadProgress(0);
                    URL.revokeObjectURL(preview);
                    setPreviewUrl(null);
                    setFile(null);
                });
            }, 0);
        },
        onDropRejected: (fileRejections: any) => {
            fileRejections.forEach((fileRejection: any) => {
                fileRejection.errors.forEach((error: any) => {
                    if (error.code === 'file-too-large') {
                        toast.error(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
                    }
                    if (error.code === 'file-invalid-type') {
                        toast.error('Please select a valid image file (JPEG, JPG, PNG, GIF)');
                    }
                });
            });
        }
    });

    // Получаем полный URL для отображения аватара
    const displayImage = previewUrl || (user?.avatar ? getAvatarUrl(user.avatar) : null);
    const isUploadingOrLoading = isUploading || loading;

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
            <Box
                {...getRootProps()}
                sx={{
                    width: 87,
                    height: 87,
                    borderRadius: '50%',
                    border: error ? '2px dashed #f44336' : '2px dashed #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: isUploadingOrLoading ? 'default' : 'pointer',
                    mb: 2,
                    overflow: 'hidden',
                    '&:hover': {
                        borderColor: isUploadingOrLoading ? '#ccc' : 'primary.main',
                    },
                    transition: 'border-color 0.2s ease-in-out',
                }}
            >
                <input id="avatarupload" accept={accept} {...getInputProps()} />

                {isUploadingOrLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <CircularProgress
                            size={24}
                            variant={isUploading ? 'determinate' : 'indeterminate'}
                            value={isUploading ? uploadProgress : undefined}
                        />
                        {isUploading && (
                            <Typography variant="caption" sx={{ fontSize: 10 }}>
                                {uploadProgress}%
                            </Typography>
                        )}
                    </Box>
                ) : displayImage ? (
                    <Avatar
                        src={displayImage}
                        alt="avatar"
                        imgProps={{
                            onError: (e: any) => {
                                console.error('Failed to load avatar image:', displayImage);
                                // При ошибке загрузки используем fallback
                                e.target.style.display = 'none';
                            }
                        }}
                        sx={{
                            width: '100%',
                            height: '100%',
                            '& img': {
                                objectFit: 'cover',
                            },
                        }}
                    />
                ) : (
                    <AddPhotoAlternateRoundedIcon sx={{fontSize: 30, color: 'gray'}}/>
                )}
            </Box>

            <Box mt={-2} display="flex" flexDirection="column" justifyContent="space-between" gap={0.5}>
                <Typography component="label" color="text.primary" variant="subtitle1" fontWeight={600}>
                    {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Please complete account'}
                    {user?.role?.name && ' | ' + user.role?.name}
                </Typography>
                <Typography component="label" color="text.disabled" variant="body1" fontWeight={500}>
                    {user?.email}
                </Typography>

                <Typography
                    display="flex"
                    alignItems="center"
                    htmlFor="avatarupload"
                    component="label"
                    fontWeight={500}
                    sx={{
                        color: (theme: any) => theme.palette.chart.blue[0],
                        cursor: isUploadingOrLoading ? 'default' : 'pointer'
                    }}
                    variant="body2"
                    color="text.secondary"
                    gap={0.5}
                >
                    <UloadPencleIcon/>
                    {isUploadingOrLoading ? 'Uploading...' : (displayImage ? 'Update photo' : 'Upload photo')}
                </Typography>
            </Box>
        </Box>
    );
};

export default AvatarUpload;
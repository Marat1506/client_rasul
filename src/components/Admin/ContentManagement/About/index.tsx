import React, {useEffect, useState} from 'react';

import {Box, Button, Fade, Paper, TextField, Typography, Stack} from '@mui/material';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {aboutUs} from '@/redux/actions/contents';
import Api from '@/services';
import { getAvatarUrl } from '@/utils/avatar';

const About = () => {
    const dispatch = useAppDispatch();
    const {data, isLoading} = useSelector((store: RootState) => store.contents.aboutUs);
    const [aboutText, setAboutText] = useState('');
    const [aboutVideo, setAboutVideo] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(aboutUs());
    }, [dispatch]);

    useEffect(() => {
        // Backend returns About as { title, content, video }
        if (data?.data?.content) {
            setAboutText(data.data.content);
        }
        if (data?.data?.video) {
            setAboutVideo(data.data.video);
            // Определяем, является ли файл видео по расширению
            const videoUrl = data.data.video;
            const isVideoFile = /\.(mp4|webm|ogg|mov|avi)$/i.test(videoUrl);
            setIsVideo(isVideoFile);
        }
    }, [data]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await Api.updateAbout({
                about: aboutText,
                video: aboutVideo
            });
            await dispatch(aboutUs());
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const resp = await Api.uploadFile(file);
            const url = resp?.data?.data?.url || resp?.data?.url;
            // Определяем тип файла из ответа бэкенда или по типу файла
            const fileIsVideo = resp?.data?.data?.isVideo !== undefined 
                ? resp.data.data.isVideo 
                : file.type.startsWith('video/');
            if (url) {
                setAboutVideo(url);
                setIsVideo(fileIsVideo);
            }
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Fade in timeout={800}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 1,
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    transition: '0.3s',
                }}
            >
                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                    О нас
                </Typography>

                {/* About Text Field */}
                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    label="Текст о нас"
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '& fieldset': {
                                borderColor: 'rgba(0,0,0,0.23)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'black',
                            },
                            '& .MuiInputBase-input': {
                                color: 'black',
                                '&::placeholder': {
                                    color: 'black',
                                    opacity: 1,
                                },
                            },
                        },
                    }}
                />

                {/* Media Upload Section */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <Button component="label" variant="outlined" disabled={uploading}>
                        {uploading ? 'Загрузка...' : isVideo ? 'Загрузить видео' : 'Загрузить изображение'}
                        <input hidden type="file" accept="image/*,video/*" onChange={handleFileChange} />
                    </Button>
                    {aboutVideo && (
                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                            Текущее медиа: {isVideo ? 'Видео' : 'Изображение'} - {aboutVideo}
                        </Typography>
                    )}
                </Stack>
                
                {/* Media Preview */}
                {aboutVideo && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                        {isVideo ? (
                            <video
                                controls
                                style={{
                                    width: '100%',
                                    maxWidth: '800px',
                                    height: 'auto',
                                    borderRadius: '8px',
                                }}
                                src={getAvatarUrl(aboutVideo)}
                            >
                                Ваш браузер не поддерживает видео.
                            </video>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={getAvatarUrl(aboutVideo)}
                                    alt="About preview"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                )}

                <br/>


                {/* Single Save Button */}
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </Paper>
        </Fade>
    );
};

export default About;
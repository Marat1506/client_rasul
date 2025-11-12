import React, {useEffect, useState} from 'react';

import {Typography, Box} from '@mui/material';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {aboutUs} from '@/redux/actions/contents';
import { getAvatarUrl } from '@/utils/avatar';

const About = () => {
    const dispatch = useAppDispatch();
    const {data, isLoading} = useSelector((store: RootState) => store.contents.aboutUs);

    useEffect(() => {
        dispatch(aboutUs());
    }, [dispatch]); 

    const aboutData = data?.data;
    console.log('=== ABOUT PAGE ===');
    console.log('Full data:', data);
    console.log('data.data:', data?.data);
    console.log('aboutData:', aboutData);
    console.log('aboutData.video:', aboutData?.video);
    console.log('aboutData has video property:', aboutData ? 'video' in aboutData : 'aboutData is null');
    console.log('aboutData keys:', aboutData ? Object.keys(aboutData) : 'aboutData is null');
    
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    // Получаем URL медиа из поля video
    const mediaUrl = aboutData?.video ? getAvatarUrl(aboutData.video) : null;
    
    // Определяем, является ли файл видео по расширению
    // Проверяем расширение в исходном значении (более надежно)
    const videoUrl = aboutData?.video || '';
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(videoUrl);

    return (
        <Box>
            <Typography mt="50px" mb="20px" variant={'h3'} fontWeight={700} color="text.primary">
                About
            </Typography>

            {/* Content */}
            {aboutData?.content && (
                <Typography variant="h6" sx={{marginTop: 2, marginBottom: 2}}>
                    {aboutData.content}
                </Typography>
            )}

            {/* Media - отображается после контента (видео или изображение) */}
            {hydrated && mediaUrl && (
                <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center' }}>
                    {isVideo ? (
                        <video
                            controls
                            style={{
                                width: '100%',
                                maxWidth: '800px',
                                height: 'auto',
                                borderRadius: '8px',
                            }}
                            src={mediaUrl}
                        >
                            Ваш браузер не поддерживает видео.
                        </video>
                    ) : (
                        <img 
                            src={mediaUrl} 
                            alt="About" 
                            style={{ 
                                maxWidth: '100%', 
                                height: 'auto', 
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }} 
                        />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default About;

import React, {useEffect} from 'react';

import {Button, Paper, Skeleton, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box} from '@mui/system';
import {useSelector} from 'react-redux';

import Logo from '@/components/Logo';
import BlurImage from '@/components/UI/BlurImage';
import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {banner} from '@/redux/actions/contents';

import styles from './Banner.module.scss';
import {SendIcon} from '../../../public/svg';

import banner_bg from '@/../public/images/banner_bg.svg';
import Icon from '@/../public/images/bannericon.svg';

const Banner = () => {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.down('md'));
    const sm = useMediaQuery(theme.breakpoints.down('sm'));

    const handleScrollToConsultation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById('consultation');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Paper
            className={styles.Banner}
            sx={{
                backgroundImage: `url(${banner_bg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >

            {sm && <Logo/>}
            <br/>
            <>
                {md ? <Typography mt={3} mb={4} variant={'subtitle2'} maxWidth={'250px'} color="white"
                                  fontWeight="600">
                        Information security and IT system integration
                    </Typography>
                    :
                    <Typography variant={'h2'} maxWidth={'800px'} color="white" fontWeight="600">
                        Information security and IT system integration
                    </Typography>}
            </>
            <Box className={styles.buttons} sx={{gap: sm ? 1 : 2.5}}>
                {/*<Button*/}
                {/*    fullWidth={sm}*/}
                {/*    sx={{*/}
                {/*        background: (theme) => theme.palette.background.paper,*/}
                {/*        color: (theme) => theme.palette.text.primary,*/}
                {/*    }}*/}
                {/*    variant={"contained"}>*/}
                {/*    {!isLoading ?*/}
                {/*        <Typography fontWeight={500} variant={"body2"}>*/}
                {/*            {data[0]?.button1}*/}
                {/*        </Typography>*/}
                {/*        :*/}
                {/*        <Skeleton sx={{*/}
                {/*            width: 130,*/}
                {/*            height: 30,*/}
                {/*        }}/>*/}
                {/*    }*/}
                {/*</Button>*/}

                <Button
                    href={'#consultation'}
                    onClick={handleScrollToConsultation}
                    fullWidth={sm}
                    variant={'contained'}
                    endIcon={<SendIcon/>}
                    sx={{
                        background: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.contrastText,
                    }}
                >
                    <Typography fontWeight={500} variant={'body2'}>
                        Report an incident
                    </Typography>
                </Button>
            </Box>

            <BlurImage src={Icon.src} alt="bannericon" width={120} height={120} className={styles.icon}/>
        </Paper>
    );
};

export default Banner;
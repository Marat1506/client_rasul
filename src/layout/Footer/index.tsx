import { useEffect, useState } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';

import { ResponsiveImage } from '@/components/UI/ResponsiveImage';

import biglogo from '../../../public/images/darkbiglogo.svg';

const Footer = () => {
    const router = useRouter();
    const theme = useTheme();
    const mdQuery = useMediaQuery(theme.breakpoints.down(860));
    const [md, setMd] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setMd(mdQuery);
    }, [mdQuery]);

    if (router.pathname === '/chat') return null;
    
    if (!mounted) {
        return null;
    }

    return (
        <> 
            {md ? (
                <Box
                    sx={{
                        backgroundColor: (theme) => theme.palette.background.paper,
                        borderRadius: '20px',
                        padding: '20px',
                        mt: 15,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" gap={2}>
                        <Box sx={{ maxWidth: 200 }}>
                            <ResponsiveImage src={biglogo.src} alt={'logo'} />
                            <Typography color={'primary'} fontWeight={600} variant={'body2'} component={'a'}>
                                By AI Stärm Technology
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 1
                            }}>
                                <Typography fontWeight={600} variant={'h5'} component={'a'}>
                                    Company
                                </Typography>

                                <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                    Partnership
                                </Typography>

                                <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                    FAQ
                                </Typography>

                                <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                    About Us
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 1,
                                paddingBottom: '30px'
                            }}>
                                <Typography fontWeight={600} variant={'h5'} component={'a'}>
                                    Info
                                </Typography>

                                <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                    Reviews
                                </Typography>

                                <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                    Contacts
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <Box>
                            <Typography variant={'body2'} color={'text.disabled'}>
                                Phone
                            </Typography>
                            <Typography>
                                <a href="tel:+971000000000" style={{textDecoration: 'none', color: 'inherit'}}>
                                    +971000000000
                                </a>
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant={'body2'} color={'text.disabled'}>
                                Email
                            </Typography>
                            <Typography>
                                <a href="mailto:sales@Security.com" style={{textDecoration: 'none', color: 'inherit'}}>
                                    sales@Security.com
                                </a>
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: 4,
                            height: 2,
                            width: '100%',
                            background: 'linear-gradient(to right, transparent, #000080, transparent)',
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        padding: '10px 0',
                        flexDirection: 'column',
                    }}>
                        <Typography variant={'body2'} color={'text.primary'}>
                            © Copyright 2024. CYBERSECURITY. All rights reserved.
                        </Typography>
                        <Typography variant={'body2'} color={'text.primary'}>
                            Privacy Policy
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        backgroundColor: (theme) => theme.palette.background.paper,
                        borderRadius: '20px',
                        padding: '45px',
                        mt: 15,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                        <Box sx={{ maxWidth: 433 }}>
                            <ResponsiveImage src={biglogo.src} alt={'logo'} />
                            <Typography color={'primary'} fontWeight={600} variant={'body2'} component={'a'}>
                                By AI Stärm Technology
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 1
                        }}>
                            <Typography fontWeight={600} variant={'h5'} component={'a'}>
                                Company
                            </Typography>

                            <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                Partnership
                            </Typography>

                            <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                FAQ
                            </Typography>

                            <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                About Us
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 1,
                            paddingBottom: '30px'
                        }}>
                            <Typography fontWeight={600} variant={'h5'} component={'a'}>
                                Info
                            </Typography>

                            <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                Reviews
                            </Typography>

                            <Typography fontWeight={400} variant={'subtitle2'} component={'a'}>
                                Contacts
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            paddingTop: '30px'
                        }}>
                            <Typography variant={'body2'} color={'text.disabled'}>
                                Phone
                            </Typography>
                            <Typography>
                                <a href="tel:+971000000000" style={{textDecoration: 'none', color: 'inherit'}}>
                                    +971000000000
                                </a>
                            </Typography>

                            <Typography variant={'body2'} color={'text.disabled'}>
                                Email
                            </Typography>
                            <Typography>
                                <a href="mailto:sales@Security.com" style={{textDecoration: 'none', color: 'inherit'}}>
                                    sales@Security.com
                                </a>
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: 4,
                            height: 2,
                            width: '100%',
                            background: 'linear-gradient(to right, transparent, #000080, transparent)',
                        }}
                    />

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 30px',
                    }}>
                        <Typography variant={'body2'} color={'text.primary'}>
                            © Copyright 2025. CYBERSECURITY. All rights reserved.
                        </Typography>
                        <Typography variant={'body2'} color={'text.primary'}>
                            Privacy Policy
                        </Typography>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Footer;
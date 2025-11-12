import React, {useEffect} from 'react';

import {Grid, Paper, Skeleton, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box} from '@mui/system';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {about} from '@/redux/actions/contents';

import styles from './Compont.module.scss';
import logo from '../../../public/images/bannericon.svg';
import bigLogo from '../../../public/images/biglogo.svg';
import {Li} from '../../../public/svg';
import {ResponsiveImage} from '../UI/ResponsiveImage';

import company_bg from '@/../public/images/company_bg.svg';


const Compony = () => {
    const theme = useTheme();

    const lg = useMediaQuery(theme.breakpoints.down(1080));
    const md = useMediaQuery(theme.breakpoints.down(830));

    return (
        <Paper
            className={styles.Compony}
            sx={{
                backgroundImage: `url(${company_bg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: 3,
                position: 'relative'
            }}
        >
            <Box display="flex" justifyContent={'space-between'}>
                <Box>
                    <Typography variant="h2" color={'white'} component="h1">
                        About the company
                    </Typography>

                    <Typography mt={1} maxWidth={440} variant="subtitle2" color={'textSecondary'} component="p">
                        CYBERHELPSECURITY is an IT security service provider and systems integrator that helps:
                    </Typography>
                    <br/>
                    <Box
                        component="ul"
                        className={styles.ul}
                    >
                        <Box component="li" sx={{marginBottom: '0.5rem'}}>

                            <Li/>

                            <Typography variant="h6" color={'white'} component="span">
                                Improve cyber security of organizations
                            </Typography>

                        </Box>
                        <Box component="li" sx={{marginBottom: '0.5rem'}}>

                            <Li/>

                            <Typography variant="h6" color={'white'} component="span">
                                Optimize business processes
                            </Typography>

                        </Box>
                        <Box component="li" sx={{marginBottom: '0.5rem'}}>

                            <Li/>

                            <Typography variant="h6" color={'white'} component="span">
                                Increase and preserve capital through IT solutions
                            </Typography>

                        </Box>
                    </Box>
                </Box>

                {!md && <Box className={styles.logo}>
                    <ResponsiveImage src={bigLogo.src} alt="logo"/>
                </Box>}
            </Box>

            {!md && <Grid mt={5} container spacing={2} justifyContent="space-between">
                <Grid item xs={3} sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h3" color={'white'} component="h1">
                        5 years
                    </Typography>

                    <Typography width={255} variant="subtitle2" color={'textSecondary'} component="p">
                        We help companies improve their business, maintain their reputation, and save money.
                    </Typography>
                </Grid>

                {!lg && <Box sx={{height: 136, width: '1px', backgroundColor: '#fff'}}/>}

                <Grid item xs={3} sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h3" color={'white'} component="h1">
                        20 companies
                    </Typography>

                    <Typography width={275} variant="subtitle2" color={'textSecondary'} component="p">
                        Successfully used our services and products
                    </Typography>
                </Grid>

                {!lg && <Box sx={{height: 136, width: '1px', backgroundColor: '#fff'}}/>}

                <Grid item xs={3} sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h3" color={'white'} component="h1">
                        2 million attacks
                    </Typography>

                    <Typography width={275} variant="subtitle2" color={'textSecondary'} component="p">
                        It was prevented
                    </Typography>
                </Grid>
            </Grid>}


            {md &&
                <Box width={1} display={'flex'} gap={2} justifyContent="space-between">
                    <Box className={styles.logo}>
                        <ResponsiveImage src={logo.src} alt="logo"/>
                    </Box>
                    <Grid>
                        <Grid mt={1} sx={{display: 'flex', flexDirection: 'column'}}>
                            <Typography variant="h3" color={'white'} component="h1">
                                5 years
                            </Typography>

                            <Typography width={255} variant="subtitle2" color={'textSecondary'} component="p">
                                We help companies improve their business, maintain their reputation, and save money.
                            </Typography>
                        </Grid>

                        <Grid mt={1} sx={{display: 'flex', flexDirection: 'column'}}>
                            <Typography variant="h3" color={'white'} component="h1">
                                20 companies
                            </Typography>

                            <Typography width={275} variant="subtitle2" color={'textSecondary'} component="p">
                                Successfully used our services and products
                            </Typography>
                        </Grid>

                        <Grid mt={1} sx={{display: 'flex', flexDirection: 'column'}}>
                            <Typography variant="h3" color={'white'} component="h1">
                                2 million attacks
                            </Typography>

                            <Typography width={260} variant="subtitle2" color={'textSecondary'} component="p">
                                It was prevented
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            }
        </Paper>
    );
};

export default Compony;
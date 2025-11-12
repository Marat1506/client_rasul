import React, {ReactNode, useEffect, useState} from 'react';

import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box} from '@mui/system';
import {useSelector} from 'react-redux';

import ReCaptcha from '@/components/ReCaptcha';
import Footer from '@/layout/Footer';
import MobileMenu from '@/layout/Menu/MobileMenu';
import Navbar from '@/layout/Navbar';
import Tabbar from '@/layout/Tabbar';
import {RootState} from '@/redux';

const Layout = ({children}: { children: ReactNode }) => {
    const [isOpenMobileMneu, setOpenMobileMenu] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [mounted, setMounted] = useState(false);
    const theme = useTheme();
    const smQuery = useMediaQuery(theme.breakpoints.down(600));
    const [sm, setSm] = useState(false);
    const {user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setMounted(true);
        setSm(smQuery);
    }, [smQuery]);

    const handleCaptchaVerify = (token: string | null) => {
        if (token) {
            setCaptchaVerified(true);
        }
    };

    return (
        <Box className="container"
             sx={{
                 position: 'relative',
                 paddingBottom: mounted && sm ? '67px' : '0'
             }}
        >
            {/*{!captchaVerified ? (*/}
            {/*    <ReCaptcha onVerify={handleCaptchaVerify} />*/}
            {/*) : (*/}
            <>
                {mounted && !sm && <Navbar/>}
                {children}
                <Footer/>
                {mounted && <Tabbar setOpenMobileMenu={setOpenMobileMenu} isOpenMobileMneu={isOpenMobileMneu} />}
            </>
            {/*)}*/}
        </Box>
    );
};

export default Layout;

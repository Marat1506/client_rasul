import React, {useEffect, useState} from 'react';

import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box} from '@mui/system';
import {useRouter} from 'next/router';

import {HomeIcon, MessageIcon, UserIcon} from '../../../public/svg';

const Tabbar = ({...props}) => {
    const {setOpenMobileMenu, isOpenMobileMneu} = props;
    const theme = useTheme();
    const smQuery = useMediaQuery(theme.breakpoints.down(600));
    const [sm, setSm] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setSm(smQuery);
    }, [smQuery]);

    const isActive = (path: string) => !isOpenMobileMneu && router.pathname === path;

    const handleItemClick = (path: string) => {
        router.push(path);
        setOpenMobileMenu(false);
    };

    if (!mounted) {
        return null;
    }

    return ( 
        <Box
            sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                width: '100%',
                height: '62px',
                position: 'fixed',
                bottom: 0,
                right: 0,
                display: sm ? 'flex' : 'none',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 51px',
                zIndex: 999,
                borderTop: '1px solid',
                borderColor: theme.palette.grey[300],
            }}
        >
            <Box onClick={() => handleItemClick('/')} sx={{cursor: 'pointer'}}>
                <HomeIcon active={isActive('/')}/>
            </Box>

            <Box onClick={() => handleItemClick('/chat')} sx={{cursor: 'pointer'}}>
                <MessageIcon active={isActive('/chat')}/>
            </Box>

            <Box onClick={() => handleItemClick('/menu')} sx={{cursor: 'pointer'}}>
                <UserIcon active={isActive('/menu')}/>
            </Box>
        </Box>
    );
};

export default Tabbar;

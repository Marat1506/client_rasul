import React from 'react';

import {Box} from '@mui/system';

import MobileMenu from '@/layout/Menu/MobileMenu';

const Menu = () => {
    return (
        <Box height={'100vh'} sx={{backgroundColor: (theme) => theme.palette.background.default}}>
            <MobileMenu/>
        </Box>
    );
};

export default Menu; 
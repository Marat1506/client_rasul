import React from 'react';

import {Box, Typography} from '@mui/material';

const NotFound = () => {
    return (
        <Box 
            sx={{
                width: '100%',
                height: 'calc(100vh - 656px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography variant={'h1'} component={'span'} fontWeight={700} color="primary">
                404 Not Found
            </Typography>
        </Box>
    );
};

export default NotFound;
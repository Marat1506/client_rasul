import React from 'react';

import {Box} from '@mui/system';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import {RootState} from '@/redux';

import LoginOtp from '../../../../components/Auth/LogIn/LogInOtp';

const Registration = () => {
    const router = useRouter();
    const {isAuthorization} = useSelector((state: RootState) => state.auth);

    if (isAuthorization) return router.push('/');

    return (
        <Box>
            <LoginOtp/>
        </Box>
    );
}; 

export default Registration;
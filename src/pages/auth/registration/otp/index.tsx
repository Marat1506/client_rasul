import React from 'react';

import {Box} from '@mui/system';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import RegistrationOtp from '@/components/Auth/Registration/RegistrationOtp';
import {RootState} from '@/redux';

const Registration = () => {
    const router = useRouter();
    const {isAuthorization} = useSelector((state: RootState) => state.auth);

    if (isAuthorization) return router.push('/');
 
    return (
        <Box>
            <RegistrationOtp/>
        </Box>
    );
};

export default Registration;
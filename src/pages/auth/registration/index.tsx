import React from 'react';

import {Box} from '@mui/system';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import RegistrationComponent from '@/components/Auth/Registration';
import {RootState} from '@/redux';

const Registration = () => {
    const router = useRouter();
    const {isAuthorization} = useSelector((state: RootState) => state.auth);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (isAuthorization && mounted) {
            // Используем setTimeout, чтобы избежать проблем с DOM во время рендеринга
            const timeoutId = setTimeout(() => {
                router.push('/');
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [isAuthorization, mounted, router]);

    // Не рендерим компонент, если пользователь авторизован
    if (isAuthorization) {
        return null;
    }
 
    return (
        <Box>
            <RegistrationComponent/>
        </Box>
    );
};

export default Registration;
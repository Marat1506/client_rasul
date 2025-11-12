import { Settings as SettingsIcon } from '@mui/icons-material';
import {AppBar, Button, Box} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Logo from '@/components/Logo';
import Menu from '@/layout/Menu';
import { RootState } from '@/redux';

import styles from './Navbar.module.scss';
 
const Navbar = () => {
    const { user, isAuthorization } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const isAdmin = isAuthorization && (user?.role === 'Administrator' || user?.role === 'moderator');

    return (
        <AppBar className={styles.Navbar} position="static">
            <Logo/>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isAdmin && (
                    <Button
                        color="inherit"
                        startIcon={<SettingsIcon />}
                        onClick={() => router.push('/admin')}
                        sx={{ textTransform: 'none' }}
                    >
                        Админ панель
                    </Button>
                )}
                <Menu/>
            </Box>
        </AppBar>
    );
};

export default Navbar;
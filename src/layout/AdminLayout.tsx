import React, {ReactNode, useEffect, useState} from 'react';

import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    Article as ArticleIcon,
    Chat as ChatIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme, 
    useMediaQuery,
    Avatar,
    Menu,
    MenuItem,
    Paper,
    Fade,
    Slide,
} from '@mui/material';
import {useRouter} from 'next/router';
import {useSelector, useDispatch} from 'react-redux';

import Logo from '@/components/Logo';
import CustomMenu from '@/layout/Menu';
import {RootState} from '@/redux';
import {logout} from '@/redux/actions/auth';


const drawerWidth = 240;

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({children}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const {user, isAuthorization} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthorization) {
            router.push('/auth/login');
            return;
        }

        if (user?.role.name !== 'Administrator' && user?.role.name !== 'Moderator') {
            router.push('/');
            return;
        }
    }, [isAuthorization, user, router]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
        handleProfileMenuClose();
    };

    const menuItems = [
        {text: 'Главная', icon: <DashboardIcon/>, path: '/admin'},
        {text: 'Пользователи', icon: <PeopleIcon/>, path: '/admin/users'},
        {text: 'Заявки', icon: <AssignmentIcon/>, path: '/admin/requests'},
        {text: 'Контент', icon: <ArticleIcon/>, path: '/admin/content'},
        {text: 'Чат поддержки', icon: <ChatIcon/>, path: '/admin/chat'},
    ];

    const drawer = (
        <Box
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Toolbar
                sx={{
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <Logo/>
            </Toolbar>
            <Divider />
            <List sx={{position: 'relative', zIndex: 2, mt: 1}}>
                {menuItems.map((item, index) => (
                    <Fade in timeout={300 + index * 100} key={item.text}>
                        <ListItem disablePadding sx={{mb: 1}}>
                            <ListItemButton
                                selected={router.pathname === item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                sx={{
                                    borderRadius: '7px',
                                    mx: 1,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&.Mui-selected': {
                                        background: 'rgba(145, 158, 171, 0.08)',
                                        '&:hover': {
                                            background: 'rgba(145, 158, 171, 0.08)',
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 4,
                                            background: 'linear-gradient(180deg, #fff, #f0f0f0)',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'white',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Fade>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{display: {sx: 'none', md: 'flex'}, justifyContent: 'end'}}>

            <AppBar
                position="fixed"
                sx={{
                    borderRadius: 0,
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                    ml: {md: `${drawerWidth}px`},
                    height: 74,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: '100% !important', // make Toolbar fill AppBar height
                        display: 'flex',
                        alignItems: 'center', // vertical centering
                        justifyContent: 'space-between', // optional: spread logo and user to edges
                    }}
                >
                    {/* Бургер-меню */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {md: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>

                    {/* Лого / заголовок */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    />

                    {/* Пользователь */}
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography
                            variant="body2"
                            sx={{
                                mr: 2,
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 500,
                            }}
                        >
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <CustomMenu/>
                    </Box>
                </Toolbar>
            </AppBar>


            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {xs: 'block', md: 'none'},
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: {xs: '100%', md: drawerWidth},
                        borderRadius: 0,
                        p: 1
                    },
                    '& .MuiDrawer-root': {width: {xs: '100%', md: drawerWidth}, borderRadius: 0, p: 1},
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: {xs: 'none', md: 'block'},
                    '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth, borderRadius: 0, p: 1},
                }}
                open
            >
                {drawer}
            </Drawer>


            <Box
                component="main"
                sx={{
                    p: 3,
                    mt: '74px',
                    width: {md: `calc(100% - ${drawerWidth}px)`},
                    // background: theme.palette.info.light,
                    minHeight: '100vh',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
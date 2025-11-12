import React, { useCallback, useEffect, useState } from 'react';

import { Button, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import BlurImage from '@/components/UI/BlurImage';
import useAppDispatch from '@/hooks/useAppDispatch';
import { Index } from '@/interfaces';
import config from '@/layout/config.json';
import { RootState } from '@/redux';
import { clean, logout } from '@/redux/actions/auth';
import {getAvatarUrl} from '@/utils/avatar';

import styles from './MenuContent.module.scss';
import about from '../../../../public/images/about.svg';
import arrow from '../../../../public/images/arrowright.svg';
import faq from '../../../../public/images/faq.svg';
import headphone from '../../../../public/images/headphone.svg';
import usericon from '../../../../public/images/user.svg';
import Api from '../../../services';

const iconMap: { [key: string]: string } = {
    helpdesk: headphone.src,
    faq: faq.src,
    about: about.src,
};

const MenuContent = ({...props}) => {
    const {setIsOpen} = props; 
    const dispatch = useAppDispatch();
    const [social, setSocial] = useState<any>([]);
    const [isLoadingSocial, setLoadingSocial] = useState(false);
    const router = useRouter();
    const {isAuthorization, user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        (async () => {
            try {
                setLoadingSocial(true);
                // const {data} = await Api.social();
                setLoadingSocial(false);
                // setSocial(data);
            } catch (e: any) {
                console.error(e);
            }
        })();
    }, []);

    const handleRedirectAuth = useCallback((path: string) => {
        router.push(`/auth/${path}`);
        setIsOpen(false);
    }, [router]);

    const handleMenu = async (slug: string) => {
        setIsOpen(false);

        if (slug === 'logout') {
            await dispatch(logout());
            await dispatch(clean());

            router.push('/auth/login');
        }
    };

    // @ts-ignore
    return (
        <Box className={styles.MenuContent}>
            {
                isAuthorization ?
                    <Box className={styles.profile} onClick={() => router.push('/profile')}>
                        <Box className={styles.avatar}>
                            <BlurImage
                                width={60}
                                height={60}
                                src={user?.avatar ? getAvatarUrl(user.avatar) : usericon.src}
                                alt={'avatar'}
                            />
                        </Box>
                        <Box className={styles.user}>
                            <Typography color={'text.primary'} lineHeight={'24px'} fontSize={15} fontWeight={600}>
                                {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Please complete account'}
                                {user.role?.name && ' | ' + user.role.name}
                            </Typography>
                            <Typography color={'text.disabled'} lineHeight={'16px'} fontSize={13} fontWeight={500}>
                                {user.email}
                            </Typography>
                        </Box>
                    </Box>
                    :
                    <Box>
                        <Button onClick={() => handleRedirectAuth('login')} sx={{mb: 1}} fullWidth
                                variant="outlined">
                            Login
                        </Button>
                        <Button onClick={() => handleRedirectAuth('registration')} fullWidth variant="outlined">
                            Registration
                        </Button>
                    </Box>
            }

            <Box>
                {/* Admin Panel Link for admin and moderator users */}
                {isAuthorization && (user?.role.name === 'Administrator' || user?.role.name === 'Moderator') && (
                    <>
                        <Link href="/admin">
                            <Button className={styles.menu_items} onClick={() => setIsOpen(false)}>
                                <Box>
                                    <BlurImage
                                        width={24}
                                        height={24}
                                        src={headphone.src}
                                        alt="Админ панель"
                                    />
                                    <Typography fontSize={14} fontWeight={400}>
                                        Dashboard
                                    </Typography>
                                </Box>
                                <BlurImage
                                    width={10}
                                    height={10}
                                    src={arrow.src}
                                    alt="Админ панель"
                                />
                            </Button>
                        </Link>
                        <Divider sx={{my: 1}}/>
                    </>
                )}

            </Box>

            <Box>
                {config.menu
                    .filter((item: Index) => {
                        // Hide Helpdesk for admin and moderator
                        if (!isAuthorization || !user) {
                            return true; // Show all items if user not loaded yet
                        }
                        
                        const userRole = user?.role?.name;
                        const isAdminOrModerator = userRole === 'Administrator' || userRole === 'Moderator';
                        
                        // Debug log
                        if (item.slug === 'helpdesk') {
                            console.log('🔍 MenuContent: Checking Helpdesk visibility', {
                                userRole,
                                isAdminOrModerator,
                                willHide: isAdminOrModerator,
                                isAuthorization,
                                hasUser: !!user,
                            });
                        }
                        
                        if (item.slug === 'helpdesk' && isAdminOrModerator) {
                            return false; // Hide Helpdesk for admin/moderator
                        }
                        return true;
                    })
                    .map((item: Index) => (
                        <React.Fragment key={item.slug}>
                            {!(item.slug === 'logout' && !isAuthorization) && (
                                <>
                                    {item.slug === 'logout' && <Divider sx={{mt: 2}}/>}
                                    <Link onClick={() => handleMenu(item.slug)} href={item.href}>
                                        <Button className={styles.menu_items}>
                                            <Box>
                                                <BlurImage
                                                    width={24}
                                                    height={24}
                                                    src={iconMap[item.icon]}
                                                    alt={item.name}
                                                />
                                                <Typography fontSize={14} fontWeight={400}>
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                            <BlurImage
                                                width={10}
                                                height={10}
                                                src={arrow.src}
                                                alt={item.name}
                                            />
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </React.Fragment>
                    ))}
            </Box>


            <Box className={styles.social}>
                {!isLoadingSocial ? social.map((item: any) => (
                    <Link key={item.slug} href={item.href}>
                        <IconButton
                            className={styles.social_icons}
                            sx={{background: (theme) => theme.palette.action.disabledBackground}}>
                            <BlurImage
                                width={20}
                                height={20}
                                src={item.icon}
                                alt={item.title}
                            />
                        </IconButton>
                    </Link>
                )) : null}
            </Box>
        </Box>
    );
};

export default MenuContent;
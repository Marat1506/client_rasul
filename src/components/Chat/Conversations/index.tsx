'use client';

import {useEffect, useState} from 'react';

import {Box, Button, Typography} from '@mui/material';
import Badge from '@mui/material/Badge';
import {alpha, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import BlurImage from '@/components/UI/BlurImage';
import {useChat} from '@/hooks/useChat';
import {RootState} from '@/redux';
import {formatDate} from '@/utils';
import {getAvatarUrl} from '@/utils/avatar';

import {SendIcon} from '../../../../public/svg';

import avatar from '@/../public/images/user.svg';

const Conversations = ({changeModalOpen}) => {
    const [mounted, setMounted] = useState(false);
    const theme = useTheme();
    const xlQuery = useMediaQuery(theme.breakpoints.down('xl'));
    const smQuery = useMediaQuery(theme.breakpoints.down('sm'));
    const mdQuery = useMediaQuery(theme.breakpoints.down(600));
    const [xl, setXl] = useState(false);
    const [sm, setSm] = useState(false);
    const [md, setMd] = useState(false);
    const {user} = useSelector((state: RootState) => state.auth);

    const router = useRouter();
    const {
        chatList,
        openChat,
        chat,
        isCreateChatModalOpen,
        loadChats,
    } = useChat();

    // Removed auto-loading - useChat hook handles loading chats
    // This prevents duplicate calls and infinite loops

    useEffect(() => {
        setMounted(true);
        setXl(xlQuery);
        setSm(smQuery);
        setMd(mdQuery);
    }, [xlQuery, smQuery, mdQuery]);


    // useEffect(() => {
    //   const handleRoomResponse = (data: any) => {
    //     console.log("joinPrivateRoomResponse received:", data);
    //     if (data?._id) {
    //       router.push("?id=" + data._id);
    //     } else {
    //       console.error("No roomId in response:", data);
    //     }
    //   };

    //   on("joinPrivateRoomResponse", handleRoomResponse);

    //   return () => {
    //     off("joinPrivateRoomResponse");
    //   };
    // }, [on, off, router]);

    const handleItemClick = (item: any) => {
        openChat(item);
    };

    if (!mounted) {
        return (
            <Box
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <>
            {md ? (
                <>
                    <Box
                        sx={{
                            height: 'calc(100vh - 80px)',
                            overflowY: 'auto',
                            boxSizing: 'border-box',
                            paddingBottom: '200px',
                            width: '100%',
                            display: chat || isCreateChatModalOpen ? 'none' : 'block',
                        }}
                        bgcolor={theme.palette.background.paper}
                    >
                        <Typography
                            sx={{
                                p: 1,
                                mt: 1,
                            }}
                            fontWeight={500}
                            textAlign="center"
                            variant="h5"
                            component="h4"
                        >
                            {(user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator') 
                              ? 'Все чаты' 
                              : 'Мои чаты'}
                        </Typography>

                        {(() => {
                            // Removed excessive logging
                            if (!Array.isArray(chatList) || chatList.length === 0) {
                                return (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="200px"
                                        p={2}
                                    >
                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                            {(user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator')
                                              ? 'Нет активных чатов'
                                              : 'У вас пока нет чатов'}
                                        </Typography>
                                    </Box>
                                );
                            }
                            return chatList.map((item: any, i: number) => (
                            <Box
                                key={`${item.id || item._id}-${i}`}
                                onClick={() => handleItemClick(item)}
                                sx={{
                                    mt: 0.5,
                                    width: '100%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    bgcolor:
                                        (item.id || item._id) === (chat?.id || chat?._id)
                                            ? alpha(theme.palette.primary.main, 0.2)
                                            : '',
                                }}
                            >
                                <Box
                                    p={1}
                                    width={1}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    gap={3}
                                >
                                    <Box display="flex" gap={1}>
                                        <BlurImage
                                            width={xl ? 50 : 60}
                                            height={xl ? 50 : 60}
                                            borderRadius={100}
                                            src={
                                              (user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator')
                                                ? (item?.user?.avatar ? getAvatarUrl(item.user.avatar) : '/images/user.svg')
                                                : '/images/user.svg'
                                            }
                                            alt={(item.id || item._id)?.toString()}
                                        />
                                        <Box display="flex" flexDirection="column">
                                            <Typography
                                                component="span"
                                                variant="subtitle2"
                                                noWrap
                                                maxWidth={100}
                                            >
                                                {(user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator')
                                                  ? (item?.user_name || 'Пользователь')
                                                  : 'Поддержка'}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                fontWeight={400}
                                                noWrap
                                                maxWidth={100}
                                                color="divider"
                                                variant="subtitle2"
                                            >
                                                {item?.last_message || 'Нет сообщений'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box gap={3} display="flex" flexDirection="column">
                                        <Typography variant="body2" noWrap maxWidth={250}>
                                            {item?.last_message_time ? formatDate(new Date(item.last_message_time).getTime()) : ''}
                                        </Typography>

                                        <Badge
                                            badgeContent={item?.unread_count || 0}
                                            max={9}
                                            overlap="circular"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    height: '22px',
                                                    minWidth: '22px',
                                                    margin: '-8px 6px',
                                                    borderRadius: '10px',
                                                    backgroundColor: theme.palette.primary.light,
                                                    color: theme.palette.primary.contrastText,
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            ));
                        })()}
                    </Box>
                    {(user?.role?.name !== 'Moderator' && user?.role?.name !== 'Administrator') && (
                        <Box
                            sx={{
                                position: 'fixed',
                                bottom: 60,
                                left: 0,
                                width: '100%',
                                zIndex: 10,
                                p: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                onClick={() => changeModalOpen(true)}
                                size="large"
                                variant="contained"
                                color="primary"
                                endIcon={<SendIcon/>}
                            >
                                <Typography
                                    fontWeight={500}
                                    textAlign="center"
                                    variant="subtitle2"
                                    component="h4"
                                >
                                    Создать новый чат
                                </Typography>
                            </Button>
                        </Box>
                    )}
                </>
            ) : (
                <Box
                    height="100%"
                    width="300px"
                    display="flex"
                    flexDirection="column"
                    {...(router.pathname !== '/' &&
                        !sm && {
                            maxWidth: 450,
                            borderRight: '0.5px solid',
                            borderColor: theme.palette.primary.main,
                        })}
                    {...((router.pathname === '/' || sm) && {
                        p: 2,
                        width: '100%',
                    })}
                >
                    <Typography
                        sx={{
                            p: 1,
                        }}
                        fontWeight={500}
                        textAlign="center"
                        variant="h5"
                        component="h4"
                    >
                        {(user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator') 
                          ? 'Все чаты' 
                          : 'Мои чаты'}
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            gap: '10px',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }}
                        mt={2}
                    >
                        {(() => {
                            // Removed excessive logging
                            if (!Array.isArray(chatList) || chatList.length === 0) {
                                return (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="200px"
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            {(user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator')
                                              ? 'Нет активных чатов'
                                              : 'У вас пока нет чатов'}
                                        </Typography>
                                    </Box>
                                );
                            }
                            return chatList.map((item: any, i: number) => (
                            <Box
                                bgcolor={
                                    (item?.id || item?._id) === (chat?.id || chat?._id)
                                        ? alpha(theme.palette.primary.main, 0.2)
                                        : ''
                                }
                                key={`${item.id || item._id}-${i}`}
                                onClick={() => handleItemClick(item)}
                                sx={{
                                    mt: 0.5,
                                    width: '100%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box
                                    p={1}
                                    width={1}
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    gap={3}
                                >
                                    <Box display={'flex'} gap={1}>
                                        <BlurImage
                                            width={xl ? 50 : 60}
                                            height={xl ? 50 : 60}
                                            borderRadius={100}
                                            src={
                                              (user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator')
                                                ? (item?.user?.avatar ? getAvatarUrl(item.user.avatar) : '/images/user.svg')
                                                : '/images/user.svg'
                                            }
                                            alt={(item.id || item._id)?.toString()}
                                        />

                                        <Box display={'flex'} flexDirection={'column'}>
                                            <Typography
                                                component={'span'}
                                                variant="subtitle2"
                                                noWrap
                                                maxWidth={100}
                                            >
                                                {(user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator')
                                                  ? (item?.user_name || 'Пользователь')
                                                  : 'Поддержка'}
                                            </Typography>

                                            <Typography
                                                component={'span'}
                                                fontWeight={400}
                                                noWrap
                                                maxWidth={100}
                                                color={'divider'}
                                                variant="subtitle2"
                                            >
                                                {item?.last_message || 'Нет сообщений'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box gap={3} display={'flex'} flexDirection={'column'}>
                                        <Typography variant="body2" noWrap maxWidth={250}>
                                            {item?.last_message_time ? formatDate(new Date(item.last_message_time).getTime()) : ''}
                                        </Typography>

                                        <Badge
                                            badgeContent={item?.unread_count || 0}
                                            max={9}
                                            overlap="circular"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    height: '22px',
                                                    minWidth: '22px',
                                                    margin: '-8px 6px',
                                                    borderRadius: '10px',
                                                    backgroundColor: (theme) =>
                                                        theme.palette.primary.light,
                                                    color: (theme) => theme.palette.primary.contrastText,
                                                },
                                            }}
                                        />
                                        {/*<span/>*/}
                                    </Box>
                                </Box>
                            </Box>
                            ));
                        })()}
                    </Box>

                    {/*{*/}
                    {/*    user.role !== "admin" && <>*/}
                    <Box height="22px"/>
                    {(user?.role?.name !== 'Moderator' && user?.role?.name !== 'Administrator') && (
                        <Box
                            sx={{
                                p: 1.5,
                                margin: 'auto',
                            }}
                        >
                            <Button
                                onClick={() => changeModalOpen(true)}
                                size={'large'}
                                variant="contained"
                                color="primary"
                                endIcon={<SendIcon/>}
                            >
                                <Typography
                                    fontWeight={500}
                                    textAlign="center"
                                    variant="subtitle2"
                                    component="h4"
                                >
                                    Создать новый чат
                                </Typography>
                            </Button>
                        </Box>
                    )}

                    {/*</>*/}
                    {/*}*/}
                </Box>
            )}
        </>
    );
};

export default Conversations;

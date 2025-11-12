'use client';

import { useEffect } from 'react';

import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';

import MessageArea from '@/components/Chat/MessageArea';
import MessageInput from '@/components/Chat/MessageInput';
import BlurImage from '@/components/UI/BlurImage';
import { useChat } from '@/hooks/useChat';
import { useSocket } from '@/hooks/useSocket';
import { RootState } from '@/redux';
import { getAvatarUrl } from '@/utils/avatar';

import avatar from '@/../public/images/user.svg';

const Chat = ({ setChatPath }: any) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down(600));
  const { on, off, socket, emit } = useSocket();
  const { sendMessage, chat, messages, closeChat } = useChat();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // For admin/moderator, show user info; for user, show "Support"
  const recipientName = user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator'
    ? chat?.user_name || 'User'
    : 'Support';

  // Get avatar URL
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : '/images/user.svg';

 
  const backHandler = () => {
    closeChat();
  };

  useEffect(() => {
    const handleMessage = (message: any) => {
      console.log('Message:', message);
    };

    const handleMessageDelivered = (data: any) => {
      console.log('Message delivered:', data);
    };

    const handleMessageRead = (data: any) => {
      console.log('Message read:', data);
    };

    on('message', handleMessage);
    on('messageDelivered', handleMessageDelivered);
    on('messageRead', handleMessageRead);

    return () => {
      off('message', handleMessage);
      off('messageDelivered', handleMessageDelivered);
      off('messageRead', handleMessageRead);
    };
  }, [socket, on, off]);

  return (
    <>
      {md ? (
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            p={1}
            borderBottom={`1px solid ${alpha(theme.palette.divider, 0.5)}`}
            width="100%"
            height={'60px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent="space-between"
          >
            <Box
              width="100%"
              height={'60px'}
              display={'flex'}
              alignItems={'center'}
            >
              <ChevronLeft
                onClick={backHandler}
                fontSize={'large'}
                cursor={'pointer'}
              />
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <BlurImage
                  width={36}
                  height={36}
                  borderRadius={100}
                  src={avatarUrl}
                  alt={'avatar'}
                />

                <Typography fontWeight={500} variant="body1" component="h4">
                  {recipientName}
                </Typography>
              </Box>
            </Box>
          </Box>

          <MessageArea
            messages={messages[chat.id] || []}
            onLoadMore={() => {}}
          />

          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              bottom: 60,
              left: 0,
              zIndex: 10,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <MessageInput
              onSendMessage={(m: string) => {
                sendMessage(m);
              }}
            />
          </Box>

          <Box height={40} />
        </Box>
      ) : (
        <Box
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            p={1}
            borderBottom={`1px solid ${alpha(theme.palette.divider, 0.5)}`}
            width="100%"
            height={'60px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent="space-between"
          >
            <Box
              width="100%"
              height={'60px'}
              display={'flex'}
              alignItems={'center'}
            >
              <ChevronLeft
                onClick={backHandler}
                fontSize={'large'}
                cursor={'pointer'}
              />
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <BlurImage
                  width={36}
                  height={36}
                  borderRadius={100}
                  src={avatarUrl}
                  alt={'avatar'}
                />

                <Typography fontWeight={500} variant="body1" component="h4">
                  {recipientName}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box flex="1" overflow="auto">
            <MessageArea
              messages={messages[chat.id] || []}
              onLoadMore={() => {}}
            />
          </Box>

          <MessageInput
              onSendMessage={(text: string) => {
                sendMessage(text);
              }}
          />
        </Box>
      )}
    </>
  );
};

export default Chat;

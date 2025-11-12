import { Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Chat from '@/components/Chat';
import Conversations from '@/components/Chat/Conversations';
import CreateChat from '@/components/Chat/CreateChat';
import BlurImage from '@/components/UI/BlurImage';
import { useChat } from '@/hooks/useChat';
import { RootState } from '@/redux';

import openchat from '../../../../public/images/openchat.svg';

import chat_bg from '@/../public/images/chat_bg.svg';
import avatar from '@/../public/images/img.png';

const Manager = () => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleOpenChat = () => {
    router.push('/chat');
  };

  const { chat, isCreateChatModalOpen, setIsCreateChatModalOpen } = useChat();

  const changeModalOpen = (value) => {
    if (Array.isArray(user) || !user) {
      router.push('/auth/login');
      return;
    }
    setIsCreateChatModalOpen(value);
  };

  return (
      <Paper
          sx={{
            flex: 1,
            backgroundImage: `url(${chat_bg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: 3,
            position: 'relative'
          }}
      >
        <Box display={'flex'} justifyContent={'space-between'} gap={1}>
          <BlurImage src={avatar.src} alt="avatar" width={100} height={100} />
          <Box
              width={1}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'space-between'}
          >
            <Box display={'flex'} justifyContent={'space-between'} gap={1}>
              <Typography color={'white'} variant="h4" fontWeight={400}>
                Alex
              </Typography>

              <BlurImage
                  onClick={handleOpenChat}
                  src={openchat.src}
                  alt="avatar"
                  width={20}
                  height={20}
              />
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} gap={1}>
              <Typography
                  color={'text.disabled'}
                  variant={'subtitle1'}
                  fontWeight={500}
              >
                Company manager online
              </Typography>

              <Typography
                  color={'text.disabled'}
                  variant={'subtitle1'}
                  fontWeight={500}
              >
                Chat
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
            sx={{
              height: 500,
              marginTop: 2,
            }}
            borderRadius={1}
            width={'100%'}
            bgcolor={theme.palette.background.paper}
        >
          {!isCreateChatModalOpen && !chat && (
              <Conversations changeModalOpen={changeModalOpen} />
          )}
          {!isCreateChatModalOpen && chat && <Chat />}
          {isCreateChatModalOpen && (
              <CreateChat changeModalOpen={changeModalOpen} />
          )}
        </Box>
      </Paper>
  );
};

export default Manager;
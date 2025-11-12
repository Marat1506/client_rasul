'use client';

import { useEffect, useState, useRef } from 'react';

import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Chat from '@/components/Chat';
import Conversations from '@/components/Chat/Conversations';
import CreateChat from '@/components/Chat/CreateChat';
import { getCookie } from '@/hooks/cookies';
import { useChat } from '@/hooks/useChat';
import { RootState } from '@/redux';

const ChatPageContent = () => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const mdQuery = useMediaQuery(theme.breakpoints.down(600));
  const [md, setMd] = useState(false);

  const router = useRouter();
  const { user, isAuthorization } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    chat,
    openChat,
    chatList,
    loadChats,
    isCreateChatModalOpen,
    setIsCreateChatModalOpen,
  } = useChat();

  const { id: roomId } = router.query;

  useEffect(() => {
    setMounted(true);
    setMd(mdQuery);
  }, [mdQuery]);

  // Open chat based on URL roomId
  // Use a ref to track the last opened chat to prevent infinite loops
  const lastOpenedChatIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (!roomId || !Array.isArray(chatList) || !chatList.length) return;
    if (!mounted) return; // Wait for component to mount

    const conversation = chatList.find((c: any) => (c.id || c._id) === roomId);
    
    // Only open if conversation exists and is different from current chat and last opened chat
    if (conversation && conversation.id !== chat?.id && conversation.id !== lastOpenedChatIdRef.current) {
      lastOpenedChatIdRef.current = conversation.id;
      openChat(conversation);
    }
  }, [roomId, chatList, chat?.id, openChat, mounted]);

  useEffect(() => {
    if (!isAuthorization) router.push('/auth/login');
  }, [isAuthorization, router]);

  // Force load chats for admin/moderator when component mounts
  // Only if user is authenticated (has token)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = getCookie('token');
    if (!token) {
      // User is not authenticated - this is normal
      return;
    }
    
    if (mounted && user?.id) {
      const isAdminOrModerator = user?.role?.name === 'Administrator' || user?.role?.name === 'Moderator';
      if (isAdminOrModerator) {
        // Force reload chats for admin/moderator
        loadChats();
      }
    }
  }, [mounted, user, loadChats]);

  const changeModalOpen = (value: boolean) => {
    setIsCreateChatModalOpen(value);
  };

  useEffect(() => {
    if (!mounted) return;
    
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Загрузка...</Typography>
      </Box>
    );
  }

  // Mobile layout: show either conversations list or chat
  if (md) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {isCreateChatModalOpen ? (
          <CreateChat changeModalOpen={changeModalOpen} />
        ) : chat ? (
          <Chat />
        ) : (
          <Conversations changeModalOpen={changeModalOpen} />
        )}
      </Box>
    );
  }

  // Desktop layout: show conversations list on left, chat on right
  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        mt: 2,
      }}
    >
      {/* Conversations list - always visible on desktop */}
      <Paper
        elevation={0}
        sx={{
          width: 400,
          minWidth: 400,
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 1,
          overflow: 'hidden',
          mr: 2,
        }}
      >
        <Conversations changeModalOpen={changeModalOpen} />
      </Paper>

      {/* Chat area - shows chat or placeholder */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          height: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {isCreateChatModalOpen ? (
          <CreateChat changeModalOpen={changeModalOpen} />
        ) : chat ? (
          <Chat />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            sx={{
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              fontWeight={500}
              textAlign="center"
              variant="h6"
              component="h6"
              color="text.secondary"
            >
              Выберите чат для начала переписки
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatPageContent;


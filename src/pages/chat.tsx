import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

// Disable SSR for chat page to avoid hydration issues
const ChatPageContent = dynamic(() => import('@/components/Chat/ChatPageContent'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography>Loading...</Typography>
    </Box>
  ),
});

const ChatPage = () => {
  return <ChatPageContent />;
};

export default ChatPage;

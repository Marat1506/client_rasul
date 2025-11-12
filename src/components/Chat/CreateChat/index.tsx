import { useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { useChat } from '@/hooks/useChat';


const CreateChat = ({ changeModalOpen }) => {
  const { createChat } = useChat();

  const handleCreateChat = () => { 
    createChat('medium');
    changeModalOpen(false);
  };

  return (
    <Box
      p={2}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Typography
          fontWeight={500}
          textAlign="center"
          variant="h4"
          component="h5"
        >
          Новый чат
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          sx={{ mt: 2, color: (theme) => theme.palette.text.secondary }}
        >
          Нажмите "Создать чат" для начала новой беседы с поддержкой
        </Typography>

        <Box
          mt={1.5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <Button
            size="large"
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => changeModalOpen(false)}
          >
            Отмена
          </Button>

          <Button
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCreateChat}
          >
            Создать чат
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateChat;

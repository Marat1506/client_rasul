import React, {useState} from 'react';

import {Box, IconButton, TextField} from '@mui/material';
import {alpha} from '@mui/material/styles';

import {SendMessageIcon} from '../../../../public/svg';

const MessageInput = ({onSendMessage}: { onSendMessage: (text: string) => void }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {  
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <Box p={2} gap={2} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
                size="small"
                fullWidth
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                }}
                InputProps={{
                    sx: {
                        borderRadius: 0.5,
                        height: '40px',
                        backgroundColor: (theme) => theme.palette.background.paper,
                        color: (theme) => theme.palette.common.black,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: (theme) => theme.palette.grey[300],
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: (theme) => alpha(theme.palette.grey[300], 0.6)
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: (theme) => theme.palette.grey[600],
                        },
                    },
                }}
            />

            <IconButton
                onClick={handleSend}
                disabled={!inputValue.trim()}
                sx={{
                    borderRadius: '10px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: (theme) => theme.palette.primary.main,
                    '&:hover': {
                        backgroundColor: (theme) => theme.palette.primary.dark,
                    },
                    '&.Mui-disabled': {
                        backgroundColor: (theme) => theme.palette.grey[300],
                    }
                }}
            >
                <SendMessageIcon/>
            </IconButton>
        </Box>
    );
};

export default MessageInput;
import React, {useCallback} from 'react';

import {Button, Paper, TextField, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useRouter} from 'next/router';

const Step = () => {
    const router = useRouter();

    const handleStep = useCallback(() => {
        router.push({
            pathname: router.pathname,
            query: {...router.query, step: 3}
        }); 
    }, [router]);

    return (
        <Paper
            sx={{
                maxWidth: 700,
                margin: '100px auto 10px'
            }}
        >
            <Typography align={'center'} variant="h2" color="white">
                Registration
            </Typography>
            <Typography align={'center'} variant="h4" color="white">
                Шаг 2 <Typography component={'span'} variant="h4" color="text.secondary">из 3</Typography>
            </Typography>

            <Typography fontWeight={400} maxWidth={400} margin={'10px auto'} align={'center'} variant="subtitle1"
                        color="text.secondary">
                Введите код, присланный вам на ваш
                Email или телефон
            </Typography>


            <form>
                <Box sx={{
                    maxWidth: 300,
                    margin: 'auto'
                }}>
                    <TextField
                        sx={{
                            width: '100%'
                        }}
                        placeholder={'Например, 34SAd2F'}
                        fullWidth
                        variant="outlined"
                        required
                        margin="dense"
                        type="email"
                    />

                    <Button
                        onClick={() => handleStep()}
                        variant={'contained'}
                        size={'large'}
                        sx={{
                            mt: 1,
                            width: '100%',
                            background: (theme) => theme.palette.background.paper,
                            color: (theme) => theme.palette.text.primary,
                        }}
                    >
                        Далее
                    </Button>
                </Box>
            </form>

            <Typography sx={{cursor: 'pointer'}} fontWeight={400} margin={'10px auto'} align={'center'} variant="body2"
                        color="text.secondary">
                Отправить код повторно
            </Typography>
        </Paper>
    );
};

export default Step;
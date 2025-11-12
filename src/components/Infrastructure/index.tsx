import React from 'react';

import {Button, Grid, Paper, TextField, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Box} from '@mui/system';

import {ArrowRight, ArrowTop} from '../../../public/svg';

const Infrastructure = () => {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.down(800));

    return (
        <Paper
            sx={{
                backgroundColor: (theme: any) => theme.palette.background.default,
                border: `1px solid ${md ? theme.palette.background.default : theme.palette.primary.light}`,
                display: !md ? 'flex' : 'unset',
                justifyContent: 'space-between',
                gap: theme.spacing(2),
                mt: 13
            }}
        >
            <Box display="flex" flexDirection="column" justifyContent="space-between">
                <Typography lineHeight={md ? '24px' : '40px'} align={md ? 'center' : 'left'} maxWidth={500}
                            fontWeight={600}
                            color={md ? 'text.primary' : 'primary'} component="h5" variant="h3"
                            m={md ? 'auto' : 'unset'}>
                    Заказать бесплатный
                    аудит инфраструктуры
                </Typography>

                {!md && <ArrowRight/>}
            </Box>

            <Box minWidth={400}>
                <form>
                    <Grid>
                        <TextField
                            sx={{
                                'div': {
                                    backgroundColor: (theme: any) => theme.palette.background.default,
                                    color: (theme) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme) => theme.palette.grey[500],
                                    opacity: 1,
                                },
                                mt: 2
                            }}
                            placeholder={'Имя'}
                            fullWidth
                            variant="outlined"
                            required
                            margin="dense"
                            type="text"
                        />

                        <TextField
                            sx={{
                                'div': {
                                    backgroundColor: (theme: any) => theme.palette.background.default,
                                    color: (theme) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme) => theme.palette.grey[500],
                                    opacity: 1,
                                },
                                mt: 2
                            }}
                            placeholder={'Phone'}
                            fullWidth
                            variant="outlined"
                            required
                            margin="dense"
                            type="number"
                        />

                        <TextField
                            sx={{
                                'div': {
                                    backgroundColor: (theme: any) => theme.palette.background.default,
                                    color: (theme) => theme.palette.secondary.dark,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme) => theme.palette.grey[500],
                                    opacity: 1,
                                },
                                mt: 2
                            }}
                            placeholder={'Почта'}
                            fullWidth
                            variant="outlined"
                            required
                            margin="dense"
                            type="email"
                        />
                    </Grid>
                    <Box>
                        <Button
                            variant={'contained'}
                            endIcon={<ArrowTop/>}
                            size={'large'}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                height: 50,
                                mt: 2,
                                background: (theme) => theme.palette.primary.main,
                            }}
                        >
                            Заказать
                        </Button>
                    </Box>
                </form>
            </Box>
        </Paper>
    );
};

export default Infrastructure;
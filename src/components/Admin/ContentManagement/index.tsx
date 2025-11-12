import React, {useEffect, useState} from 'react';

import {Add, Edit, Delete} from '@mui/icons-material';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {faq} from '@/redux/actions/contents';
import Api from '@/services';

import About from './About';

export default function ContentManagement() {
    const dispatch = useAppDispatch();
    const {data, isLoading} = useSelector((store: RootState) => store.contents.faq);

    const [openDialog, setOpenDialog] = useState(false);
    const [editingFaq, setEditingFaq] = useState<any>(null);
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');
    const [activeSection, setActiveSection] = useState<'about' | 'faq'>('about');

    useEffect(() => {
        dispatch(faq());
    }, [dispatch]);

    const handleOpenDialog = (faqItem: any = null) => {
        if (faqItem) {
            setEditingFaq(faqItem);
            setFaqQuestion(faqItem.question);
            setFaqAnswer(faqItem.answer);
        } else {
            setEditingFaq(null);
            setFaqQuestion('');
            setFaqAnswer('');
        }
        setOpenDialog(true);
    };

    const handleSaveFaq = async () => {
        try {
            if (editingFaq) {
                await Api.updateFaq({
                    id: editingFaq.id,
                    question: faqQuestion,
                    answer: faqAnswer,
                });
            } else {
                await Api.createFaq({
                    question: faqQuestion,
                    answer: faqAnswer,
                });
            }
            setOpenDialog(false);
            dispatch(faq());
        } catch (err) {
            console.error('Ошибка при сохранении FAQ:', err);
        }
    };

    const handleDeleteFaq = async (id: string) => {
        try {
            await Api.deleteFaq(id);
            dispatch(faq());
        } catch (err) {
            console.error('Ошибка при удалении FAQ:', err);
        }
    };

    const handleSectionChange = (
        event: React.MouseEvent<HTMLElement>,
        newSection: 'about' | 'faq' | null
    ) => {
        if (newSection !== null) {
            setActiveSection(newSection);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'primary',
                }}
            >
                Управление контентом
            </Typography>

            {/* Section Toggle Buttons */}
            <Box sx={{ mb: 3 }}>
                <ToggleButtonGroup
                    value={activeSection}
                    exclusive
                    onChange={handleSectionChange}
                    aria-label="section selection"
                    sx={{
                        '& .MuiToggleButton-root': {
                            px: 3,
                            py: 1,
                        }
                    }}
                >
                    <ToggleButton value="about" aria-label="about section">
                        О нас
                    </ToggleButton>
                    <ToggleButton value="faq" aria-label="faq section">
                        FAQ
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* About Us Section */}
            {activeSection === 'about' && (
                <Fade in={activeSection === 'about'} timeout={500}>
                    <div>
                        <About/>
                    </div>
                </Fade>
            )}

            {/* FAQ Section */}
            {activeSection === 'faq' && (
                <Fade in={activeSection === 'faq'} timeout={500}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 1,
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(12px)',
                            transition: '0.3s',
                            '&:hover': {boxShadow: '0 8px 25px rgba(0,0,0,0.15)'},
                        }}
                    >
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                            <Typography variant="h6" sx={{fontWeight: 600}}>
                                FAQ
                            </Typography>
                            <Button
                                startIcon={<Add/>}
                                variant="contained"
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Добавить
                            </Button>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 700}}>Вопрос</TableCell>
                                    <TableCell sx={{fontWeight: 700}}>Ответ</TableCell>
                                    <TableCell sx={{fontWeight: 700}} align="right">
                                        Действия
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.data?.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.question}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.answer}
                                                sx={{background: 'rgba(0,0,0,0.04)', fontSize: 13}}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(item)}
                                            >
                                                <Edit/>
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteFaq(item.id)}
                                            >
                                                <Delete/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Fade>
            )}

            {/* FAQ Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'white',
                        borderRadius: 1,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                }}
            >
                <DialogTitle sx={{fontWeight: 600}}>
                    {editingFaq ? 'Редактировать FAQ' : 'Добавить FAQ'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Вопрос"
                        fullWidth
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        sx={{
                            mt: 2,
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: 1,
                                '& fieldset': {borderColor: 'rgba(0,0,0,0.23)',},
                                '&:hover fieldset': {borderColor: 'black',},
                                '&.Mui-focused fieldset': {borderColor: 'black',},
                                '& .MuiInputBase-input': {
                                    color: 'black',
                                    '&::placeholder': {color: 'black', opacity: 1,},
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Ответ"
                        fullWidth
                        multiline
                        minRows={3}
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        sx={{
                            mt: 2,
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: 1,
                                '& fieldset': {borderColor: 'rgba(0,0,0,0.23)',},
                                '&:hover fieldset': {borderColor: 'black',},
                                '&.Mui-focused fieldset': {borderColor: 'black',},
                                '& .MuiInputBase-input': {
                                    color: 'black',
                                    '&::placeholder': {color: 'black', opacity: 1,},
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveFaq}
                        sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
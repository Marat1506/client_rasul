import React, {useEffect} from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Skeleton} from '@mui/material';
import {useSelector} from 'react-redux';

import {ResponsiveImage} from '@/components/UI/ResponsiveImage';
import TagTypography from '@/components/UI/TagTypography';
import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {faq} from '@/redux/actions/contents';
import {faqPage} from '@/redux/actions/pages';

import image from '../../public/images/q.svg';

const Faq = () => {
    const dispatch = useAppDispatch();
    const {data, isLoading} = useSelector((store: RootState) => store.contents.faq);

    useEffect(() => {
        dispatch(faq());
    }, []);

    return (
        <Box>
            <Typography mt="20px" variant={'h3'} fontWeight={700} color="text.primary">
               FAQ
            </Typography> 

            <Grid container spacing={4} mt={1}>
                {!isLoading ?
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            {data.data.map((faq: any, index: number) => (
                                <Grid item xs={12} key={faq.id}>
                                    <Accordion sx={{
                                        padding: 0,
                                        margin: 0,
                                        backgroundColor: 'white',
                                        boxShadow: 'none !important',
                                        border: 'none !important',
                                        overflow: 'hidden !important',
                                    }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls={`panel${index}-content`}
                                            id={`panel${index}-header`}
                                            sx={{
                                                background: (theme) => theme.palette.background.paper,
                                            }}
                                        >
                                            <Typography margin={'10px 0'} fontSize={16}
                                                        fontWeight={500}>{faq.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{background: (theme) => theme.palette.background.paper,}}>
                                            <Typography mt={'-14px'} fontSize={16}
                                                        color={'text.disabled'}>{faq.answer}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid> :
                    <>
                        <Box paddingLeft={4} display={'flex'} flexDirection={'column'}>
                            <Skeleton sx={{width: {xs: 300, sm: 500}, height: 100}}/>
                            <Skeleton sx={{width: {xs: 300, sm: 500}, height: 100}}/>
                            <Skeleton sx={{width: {xs: 300, sm: 500}, height: 100}}/>
                            <Skeleton sx={{width: {xs: 300, sm: 500}, height: 100}}/>
                        </Box>
                    </>
                }
                <Grid item xs={12} md={6} sx={{display: {xs: 'none', md: 'block'}}}>
                    <ResponsiveImage src={image.src} alt={'FAQ Image'}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Faq;

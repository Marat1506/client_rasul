import React from 'react';

import {Card, Paper, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {formatDistanceToNow} from 'date-fns';

import BlurImage from '@/components/UI/BlurImage';
import {ResponsiveImage} from '@/components/UI/ResponsiveImage';

import styles from './Reviews.module.scss';
import decoration1 from '../../../../public/images/d.png';
import decoration2 from '../../../../public/images/d.png';
import decoration3 from '../../../../public/images/d.png';
import decoration4 from '../../../../public/images/d.png';
import {Star} from '../../../../public/svg';

import avatar from '@/../public/images/user.svg';

const decorations = [decoration1, decoration2, decoration3, decoration4];

const Reviews = ({...props}) => {
    const {reviews, isLoading} = props;
    return (
        <Paper sx={{backgroundColor: (theme) => theme.palette.background.default, mt: 10, p: 3}}>
            <Typography fontWeight={600} color={'primary'} component="h2" variant="h2">
                Customer Reviews
            </Typography> 

            <Box className={styles.scrollContainer}>
                <Box className={styles.cards}>
                    {reviews.map((item: any, index: number) => {
                        const decoration = decorations[index % decorations.length];
                        return (
                            <Card key={item.id || `review-${index}`} sx={{
                                width: 341,
                                height: 380,
                                padding: 0,
                                flexShrink: 0
                            }}>
                                <Box p={3}>
                                    <Box display={'flex'} gap={1}>
                                        <Box className={styles.avatar}>
                                            <BlurImage
                                                width={64}
                                                height={64}
                                                src={item.user?.avatar || avatar.src}
                                                alt={'avatar'}
                                            />
                                        </Box>

                                        <Box width={1} display={'flex'} flexDirection={'column'}
                                             justifyContent={'space-between'} pt={1} pb={1}>
                                            <Typography variant="subtitle1" component="h5">
                                                {item.user?.first_name && item.user?.last_name 
                                                    ? `${item.user.first_name} ${item.user.last_name}`
                                                    : item.user_name || 'Пользователь'}
                                            </Typography>
                                            <Box display="flex" justifyContent="space-between">
                                                <Box>
                                                    {Array.from({length: Number(item.rating)}, (_, i) => (
                                                        <Star key={i}/>
                                                    ))}
                                                </Box>
                                                <Typography variant="body1" component="h5">
                                                    {formatDistanceToNow(new Date(item?.date_created || item?.created_at), {addSuffix: true})}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Typography
                                        sx={{
                                            overflowY: 'auto',
                                            scrollbarWidth: 'none',
                                            '&::-webkit-scrollbar': {
                                                display: 'none',
                                            },
                                        }}
                                        height={'145px'}
                                        mt={2}
                                        fontWeight={400}
                                        lineHeight={'27px'}
                                        variant="h6"
                                        component="p"
                                    >
                                        {item.review || item.comment}
                                    </Typography>
                                </Box>

                                <Box mt={-4}>
                                    <ResponsiveImage
                                        src={decoration}
                                        alt={'decoration'}
                                    />
                                </Box>
                            </Card>
                        );
                    })}
                </Box>
            </Box>
        </Paper>
    );
};

export default Reviews;

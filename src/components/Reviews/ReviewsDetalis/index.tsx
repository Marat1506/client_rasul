import React, {useEffect, useState} from 'react';

import {Button, Collapse, Grid} from '@mui/material';
import {toast} from 'react-toastify';

import Api from '../../../services';
import ReviewOverview from '../Overview';
import ReviewForm from '../ReviewForm';
import ReviewsList from '../ReviewsList';


const calculateReviewsSummary = (reviews: any) => {
    const summary = [1, 2, 3, 4, 5].map((rating) => ({
        _id: rating,
        count: reviews.filter((review: any) => review.rating === rating).length,
    }));
    return summary.reverse();
};

export default function ProductDetailsReview({...props}) {
    const [state, setState] = useState<any[]>([]); 
    const [totalRating, setTotalRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewsSummery, setReviewsSummery] = useState<any>([]);
    const [isShowReviews, setShowReviews] = useState(false);

    // Only the changed useEffect part:
    useEffect(() => {
        (async () => {
            try {
                const {data} = await Api.getReviews();
                console.log(data);

                // Use data directly if it's an array, otherwise use data.data
                const reviewsData = Array.isArray(data) ? data : data.data;

                // Преобразуем данные для совместимости с компонентом отображения
                const normalizedReviews = (Array.isArray(reviewsData) ? reviewsData : []).map((review: any) => ({
                    ...review,
                    review: review.comment || review.review, // Компонент ReviewsList ожидает поле 'review'
                    date_created: review.created_at || review.date_created, // Компонент ожидает 'date_created'
                }));

                setState(normalizedReviews.reverse());
                setIsLoading(false);

                // Calculate total rating properly
                const total = normalizedReviews.reduce((sum: number, review: any) =>
                    sum + parseInt(review.rating || 0), 0
                );
                const avgRating = normalizedReviews.length > 0 ? total / normalizedReviews.length : 0;
                setTotalRating(avgRating);

                setReviewsSummery(calculateReviewsSummary(normalizedReviews));
            } catch (error: any) {
                console.log('Failed to fetch reviews. Please try again later');
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <ReviewsList reviews={state} isLoading={isLoading}/>
            <Button
                type="submit"
                variant="contained"
                onClick={() => setShowReviews((prev) => !prev)}
                sx={{
                    marginLeft: 3
                }}
            >
                {isShowReviews ? 'Hide post reviews' : 'Show post reviews'}
            </Button>
            {isShowReviews && <Grid container>
                <Grid item xs={12} md={4}>
                    <ReviewOverview
                        totalRating={totalRating}
                        totalReviews={state?.length}
                        reviews={state}
                        reviewsSummery={reviewsSummery}
                    />
                    <br/>
                </Grid>
                <Grid item xs={12} md={8}>
                    <ReviewForm
                        onAddingReview={(v: any) => setState([v, ...state])}
                        id="move_add_review"
                    />
                </Grid>
            </Grid>}
        </>
    );
}
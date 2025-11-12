import {createAsyncThunk} from '@reduxjs/toolkit';

import Api from '../../services';

export const faq = createAsyncThunk('content/faq', async () => {
    const {data} = await Api.getFaq();

    return data;
});

export const banner = createAsyncThunk('content/banner', async () => {
    const {data} = await Api.getBanner();

    return data;
}); 

export const leaveRequest = createAsyncThunk('content/leaveRequest', async () => {
    const {data} = await Api.leaveRequest();

    return data;
});

export const advantages = createAsyncThunk('content/advantages', async () => {
    const {data} = await Api.advantages();

    return data;
});

export const about = createAsyncThunk('content/about', async () => {
    const {data} = await Api.getAboutData();

    return data;
});

export const reviews = createAsyncThunk('content/reviews', async () => {
    const {data} = await Api.getReviews();

    return data;
});

export const footer = createAsyncThunk('content/footer', async () => {
    const {data} = await Api.footer();

    return data;
});

export const aboutUs = createAsyncThunk('content/aboutUs', async () => {
    const {data} = await Api.aboutUs();

    return data;
});

export const users = createAsyncThunk('content/users', async () => {
    const {data} = await Api.users();

    return data;
});

export const requests = createAsyncThunk('content/requests', async () => {
    const {data} = await Api.requests();

    return data;
});


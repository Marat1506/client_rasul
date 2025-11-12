import {createAsyncThunk} from '@reduxjs/toolkit';

import {Leads} from '@/interfaces';

import Api from '../../services';

export const faqPage = createAsyncThunk('pages/faq', async (page: string) => {
    const {data} = await Api.getPage(page);

    return data;
});

export const leads = createAsyncThunk('pages/leads', async (payload: any, {rejectWithValue}) => {
        try {
            const {data} = await Api.leads(payload);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            return rejectWithValue({status: error.response?.status, message});
        }
    } 
);
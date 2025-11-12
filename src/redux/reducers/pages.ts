import {createReducer} from '@reduxjs/toolkit';

import {faqPage, leads} from '@/redux/actions/pages';

interface InitialState {
    faq: {
        data: any
        isLoading: boolean,
        isFail: boolean,
    },
    leads: {
        data: any,
        isLoading: boolean,
        isFail: boolean,
        isSuccess: boolean,
        message: string,
    },
} 

const initialState: InitialState = {
    faq: {
        data: [],
        isLoading: true,
        isFail: false,
    },
    leads: {
        data: [],
        isLoading: false,
        isFail: false,
        isSuccess: false,
        message: '',
    },
};

export default createReducer(initialState, (builder) => {
    builder
        .addCase(faqPage.pending, (state) => {
            state.faq.isLoading = true;
        })
        .addCase(faqPage.fulfilled, (state, action) => {
            state.faq.isLoading = false;
            state.faq.data = action.payload;
        })
        .addCase(faqPage.rejected, (state) => {
            state.faq.isFail = true;
        })

        .addCase(leads.pending, (state) => {
            state.leads.isLoading = true;
        })
        .addCase(leads.fulfilled, (state, action) => {
            state.leads.isSuccess = true;
            state.leads.data = action.payload;
            state.leads.message = action.payload.message;
        })
        .addCase(leads.rejected, (state, action: any) => {
            state.leads.isFail = true;
            state.leads.message = action.payload?.message[0].message || 'An error occurred';
        });
});
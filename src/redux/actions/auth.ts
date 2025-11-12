import {createAction, createAsyncThunk} from '@reduxjs/toolkit';

import {LogIn, Register, User} from '@/interfaces';

import Api from '../../services';

export const register = createAsyncThunk('auth/register', async (payload: Register, {rejectWithValue}) => {
        try {
            const {data} = await Api.register(payload);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            return rejectWithValue({status: error.response?.status, message});
        } 
    }
);

export const login = createAsyncThunk('auth/login', async (payload: LogIn, {rejectWithValue}) => {
        try {
            const {data} = await Api.login(payload);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            return rejectWithValue({status: error.response?.status, message});
        }
    }
);

export const resettingUser = createAsyncThunk('auth/resettingUser', async (payload: any, {rejectWithValue}) => {
        try {
            const {data} = await Api.resettingUser(payload);
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            return rejectWithValue({status: error.response?.status, message});
        }
    }
);

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
        const {data} = await Api.getCurrentUser();
        return data;
    }
);


export const otp = createAction('auth/otp', (user) => {
    return {
        payload: {
            user,
        }
    };
});

export const logout = createAction('auth/logout');

export const clean = createAction('auth/clean');


import { createAsyncThunk } from '@reduxjs/toolkit';

import Api from '../../services';

export const createConversation = createAsyncThunk(
    'chat/createConversation',
    async (priority: 'low' | 'medium' | 'high' = 'medium') => {
        const response = await Api.createConversation(priority);
        // Backend returns { data: {...}, message: '...' }, so we need to extract data.data
        return response.data?.data || response.data || null;
    }
);

export const getConversations = createAsyncThunk(
    'chat/getConversations',
    async (params: { status?: string; user_id?: string; search?: string } | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await Api.getConversations(params);
            // Backend returns { data: [...] }, so we need to extract data.data
            const conversations = response.data?.data || response.data || [];
            return Array.isArray(conversations) ? conversations : [];
        } catch (error: any) {
            // Don't log 401 errors as they are expected when user is not authenticated
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized');
            }
            console.error('❌ API: getConversations error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to get conversations');
        }
    }
);

export const getMyConversations = createAsyncThunk(
    'chat/getMyConversations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await Api.getMyConversations();
            // Backend returns { data: [...] }, so we need to extract data.data
            const conversations = response.data?.data || response.data || [];
            return Array.isArray(conversations) ? conversations : [];
        } catch (error: any) {
            // Don't log 401 errors as they are expected when user is not authenticated
            if (error.response?.status === 401) {
                return rejectWithValue('Unauthorized');
            }
            console.error('❌ API: getMyConversations error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to get conversations');
        }
    }
);

export const getConversationById = createAsyncThunk(
    'chat/getConversationById',
    async (id: string) => {
        const response = await Api.getConversationById(id);
        // Backend returns { data: {...} }, so we need to extract data.data
        return response.data?.data || response.data || null;
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, content }: { conversationId: string; content: string }) => {
        const response = await Api.sendMessage(conversationId, content);
        // Backend returns { data: {...} }, so we need to extract data.data
        return response.data?.data || response.data || null;
    }
);

export const getMessages = createAsyncThunk(
    'chat/getMessages',
    async ({ conversationId, limit = 50, offset = 0 }: { conversationId: string; limit?: number; offset?: number }) => {
        const response = await Api.getMessages(conversationId, limit, offset);
        // Backend returns { data: [...] }, so we need to extract data.data
        const messages = response.data?.data || response.data || [];
        return Array.isArray(messages) ? messages : [];
    }
);

export const markAsRead = createAsyncThunk(
    'chat/markAsRead',
    async (conversationId: string) => {
        await Api.markAsRead(conversationId);
        return conversationId;
    }
);

export const getChatStats = createAsyncThunk(
    'chat/getChatStats',
    async () => {
        const response = await Api.getChatStats();
        // Backend returns { data: {...} }, so we need to extract data.data
        const stats = response.data?.data || response.data || null;
        return stats;
    }
);


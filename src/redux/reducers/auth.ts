import {createReducer} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import {setCookie} from 'undici-types';

import {createCookies} from '@/hooks/cookies';
import {clean, register, login, logout, resettingUser, otp, getCurrentUser} from '@/redux/actions/auth';

interface InitialState {
    user: any,
    isAuthorization: boolean,
    register: {
        data: any,
        isLoading: boolean,
        isFail: boolean,
        isSuccess: boolean,
        message: string,
    }, 
    login: {
        data: any,
        isLoading: boolean,
        isFail: boolean,
        isSuccess: boolean,
        message: string,
    },
    getUser: {
        data: any,
        isLoading: boolean,
        isFail: boolean,
        isSuccess: boolean,
        message: string,
    },
    resettingUser: {
        data: any,
        isLoading: boolean,
        isFail: boolean,
        isSuccess: boolean,
        message: string,
    },
}

const initialState: InitialState = {
    user: Cookies.get('isAuthorization') === 'true' ? JSON.parse(Cookies.get('user')) : [],
    isAuthorization: Cookies.get('isAuthorization') === 'true',
    register: {
        data: [],
        isLoading: false,
        isFail: false,
        isSuccess: false,
        message: '',
    },
    login: {
        data: [],
        isLoading: false,
        isFail: false,
        isSuccess: false,
        message: '',
    },
    getUser: {
        data: [],
        isLoading: false,
        isFail: false,
        isSuccess: false,
        message: '',
    },
    resettingUser: {
        data: [],
        isLoading: false,
        isFail: false,
        isSuccess: false,
        message: '',
    },
};

export default createReducer(initialState, (builder) => {
    builder
        // Handle Register

        .addCase(register.pending, (state) => {
            state.register.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.register.isSuccess = true;
            // state.register.data = action.payload;
            // state.register.message = "Created";
            // state.user = action.payload;
            // state.isAuthorization = true;
            // Cookies.set('user', JSON.stringify(action.payload));
            // Cookies.set('isAuthorization', 'true');
        })
        .addCase(register.rejected, (state, action: any) => {
            state.register.isFail = true;
            state.register.message = action.payload?.message;
        })

        .addCase(otp, (state, action) => {
            state.user = action.payload?.user;
            Cookies.set('user', JSON.stringify(action.payload?.user));
            Cookies.set('isAuthorization', 'true');
        })

        // Handle Login

        .addCase(login.pending, (state) => {
            state.login.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            // Правильная структура: data.tokens.access_token и data.tokens.refresh_token
            const tokens = action.payload.data.tokens;
            if (tokens) {
                createCookies('token', tokens.access_token);
                createCookies('refresh_token', tokens.refresh_token);
            }
            
            // Сохраняем данные пользователя после логина
            const userData = action.payload.data.user;
            if (userData) {
                // Не сохраняем password в state
                const { password, ...userWithoutPassword } = userData;
                state.user = userWithoutPassword;
                Cookies.set('user', JSON.stringify(userWithoutPassword));
                console.log('User data after login:', userWithoutPassword);
                console.log('User avatar after login:', userWithoutPassword.avatar);
                console.log('User description after login:', userWithoutPassword.description);
            }
            
            state.login.isSuccess = true;
            state.login.message = action.payload.message || 'You have successfully logged in';
            state.isAuthorization = true;
            Cookies.set('isAuthorization', 'true');
        })
        .addCase(login.rejected, (state, action: any) => {
            state.login.isFail = true;
            state.login.message = action.payload?.message;
        })

        // Handle get user

        .addCase(getCurrentUser.pending, (state) => {
            state.getUser.isLoading = true;
        })
        .addCase(getCurrentUser.fulfilled, (state, action) => {
            console.log('getCurrentUser.fulfilled:', action.payload);
            console.log('getCurrentUser.fulfilled payload.data:', action.payload?.data);
            console.log('getCurrentUser.fulfilled payload.data.avatar:', action.payload?.data?.avatar);
            console.log('getCurrentUser.fulfilled payload.data.description:', action.payload?.data?.description);
            state.getUser.isLoading = false;
            state.getUser.isSuccess = true;
            state.getUser.data = action.payload;
            
            const newUser = action.payload.data;
            if (newUser) {
                // Объединяем данные: если в новом ответе нет avatar/description, но они есть в текущем state, сохраняем их
                // Это временное решение, пока Prisma Client не обновлен
                if (!newUser.avatar && state.user?.avatar) {
                    newUser.avatar = state.user.avatar;
                    console.log('Preserving existing avatar from state:', state.user.avatar);
                }
                if (!newUser.description && state.user?.description) {
                    newUser.description = state.user.description;
                    console.log('Preserving existing description from state:', state.user.description);
                }
                
                // Также проверяем cookie - может там есть данные
                try {
                    const cookieUser = Cookies.get('user');
                    if (cookieUser) {
                        const parsedUser = JSON.parse(cookieUser);
                        if (!newUser.avatar && parsedUser?.avatar) {
                            newUser.avatar = parsedUser.avatar;
                            console.log('Preserving existing avatar from cookie:', parsedUser.avatar);
                        }
                        if (!newUser.description && parsedUser?.description) {
                            newUser.description = parsedUser.description;
                            console.log('Preserving existing description from cookie:', parsedUser.description);
                        }
                    }
                } catch (e) {
                    console.error('Error parsing user from cookie:', e);
                }
                
                state.user = newUser;
            }
            console.log('Updated state.user from getCurrentUser:', state.user);
            console.log('Updated state.user.avatar from getCurrentUser:', state.user?.avatar);
            console.log('Updated state.user.description from getCurrentUser:', state.user?.description);
            state.isAuthorization = true;
            Cookies.set('user', JSON.stringify(state.user));
            Cookies.set('isAuthorization', 'true');
        })
        
        // Handle Resetting User (update profile)
        .addCase(getCurrentUser.rejected, (state, action: any) => {
            state.getUser.isLoading = false;
            state.getUser.isFail = true;
            state.getUser.message = action.payload?.message || 'Failed to get user data';
        })

        // Handle Resetting User

        .addCase(resettingUser.pending, (state) => {
            state.resettingUser.isLoading = true;
        })
        .addCase(resettingUser.fulfilled, (state, action) => {
            console.log('resettingUser.fulfilled:', action.payload);
            console.log('Avatar in payload:', action.payload?.data?.avatar);
            state.resettingUser.isSuccess = true;
            state.resettingUser.data = action.payload?.data;
            state.resettingUser.message = 'Profile updated successfully';
            // Обновляем данные пользователя в состоянии
            state.user = action.payload?.data;
            console.log('Updated state.user:', state.user);
            console.log('Updated state.user.avatar:', state.user?.avatar);
            // Обновляем cookie с новыми данными
            Cookies.set('user', JSON.stringify(action.payload?.data));
            // Также обновляем данные getCurrentUser если они есть
            if (state.getUser.data) {
                state.getUser.data = action.payload;
            }
        })
        .addCase(resettingUser.rejected, (state, action: any) => {
            state.resettingUser.isFail = true;
            state.resettingUser.message = action.payload?.message[0].message;
        })

        // Handle Log out

        .addCase(logout, (state) => {
            state.user = [];
            state.isAuthorization = false;
            Cookies.remove('user');
            Cookies.remove('isAuthorization');
            Cookies.remove('token');
            Cookies.remove('refresh_token');
        })

        // Handle Clean

        .addCase(clean, (state) => {
            state.register.data = [];
            state.register.isLoading = false;
            state.register.isFail = false;
            state.register.isSuccess = false;
            state.register.message = '';
            state.login.data = [];
            state.login.isLoading = false;
            state.login.isFail = false;
            state.login.isSuccess = false;
            state.login.message = '';
        });
});
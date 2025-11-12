import { useEffect } from 'react';
import useAppDispatch from './useAppDispatch';
import { getCurrentUser } from '@/redux/actions/auth';
import { getCookie } from './cookies.js';

/**
 * Hook для загрузки данных пользователя при инициализации приложения
 */
export const useAuth = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Проверяем есть ли токен в cookie
        const token = getCookie('token');
        const isAuthorized = getCookie('isAuthorization') === 'true';
        
        // Если пользователь авторизован и есть токен, загружаем данные пользователя
        // Это гарантирует, что у нас всегда актуальные данные с сервера
        if (token && isAuthorized) {
            // Загружаем данные пользователя при инициализации приложения
            // Это необходимо, чтобы получить актуальные данные (включая аватар) с сервера
            dispatch(getCurrentUser());
        }
    }, [dispatch]);
};


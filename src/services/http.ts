import axios, { InternalAxiosRequestConfig } from 'axios';

import { getCookie, createCookies, deleteCookies } from '@/hooks/cookies';

// Расширяем тип для поддержки _retry флага
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Получаем базовый URL из переменных окружения
const backendURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// В продакшене (HTTPS) используем прокси через Next.js API routes для обхода Mixed Content
// В разработке используем прямой URL к бэкенду
const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';
// Убираем trailing slash для правильного формирования путей
const baseURL = isProduction ? '/api/proxy' : backendURL.replace(/\/$/, '');

// Функция для получения полного URL бэкенда (для refresh token и других серверных запросов)
const getBackendURL = () => backendURL;

const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) { 
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const http = axios.create({
    baseURL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // НЕ устанавливаем Authorization здесь - он будет установлен в request interceptor из cookies
        // Это предотвращает использование неверного apiToken из env переменных
    },
});

http.interceptors.request.use((config) => {
    // Проверяем, что мы на клиентской стороне (только в браузере)
    if (typeof window === 'undefined') {
        return config;
    }
    
    const extendedConfig = config as ExtendedAxiosRequestConfig;
    
    // Если это повторный запрос после обновления токена (_retry === true),
    // НЕ изменяем заголовки - они уже установлены с новым токеном
    if (extendedConfig._retry) {
        return config;
    }
    
    // Если заголовок Authorization уже установлен явно (например, после обновления токена),
    // НЕ перезаписываем его - это критично для корректной работы после обновления токена
    // Проверяем наличие заголовка и что он начинается с 'Bearer '
    const existingAuth = config.headers?.Authorization || config.headers?.authorization;
    if (existingAuth && typeof existingAuth === 'string' && existingAuth.trim().startsWith('Bearer ')) {
        return config; // Используем существующий заголовок
    }
    
    // Получаем токен из куки только если заголовок не установлен
    const token = getCookie('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // Если токена нет, убеждаемся, что заголовок Authorization не установлен
        // Это предотвращает использование неверного токена из env переменных
        if (config.headers) {
            delete config.headers.Authorization;
        }
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Silently handle token refresh - this is normal operation
            if (isRefreshing) {
                // Queue request if refresh is already in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        // Создаем новый объект конфигурации с явно установленным заголовком
                        const retryConfig = {
                            ...originalRequest,
                            _retry: true, // Помечаем, что это повторный запрос
                            headers: {
                                ...originalRequest.headers,
                                Authorization: `Bearer ${token}`, // Явно устанавливаем новый токен
                            },
                        };
                        
                        // Убеждаемся, что заголовок установлен (на случай, если headers был undefined)
                        if (!retryConfig.headers) {
                            retryConfig.headers = {};
                        }
                        retryConfig.headers.Authorization = `Bearer ${token}`;
                        
                        // Повторяем запрос через наш http экземпляр
                        // Request interceptor проверит _retry флаг и не будет перезаписывать заголовок
                        return http(retryConfig);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Проверяем, что мы на клиентской стороне
                if (typeof window === 'undefined') {
                    return Promise.reject(error);
                }
                
                const refreshToken = getCookie('refresh_token');
                if (!refreshToken) {
                    // Если нет refresh token, возможно пользователь не авторизован
                    // Не логируем ошибку, так как это нормальная ситуация
                    return Promise.reject(error);
                }

                // Исправляем URL - правильный эндпоинт для refresh токена
                // В продакшене используем прокси (прокси уберет первый 'api' из пути)
                // В разработке - прямой URL
                const refreshURL = isProduction 
                    ? '/api/proxy/api/v1/users/refresh-token'  // Прокси уберет первый 'api', получится /api/v1/users/refresh-token
                    : `${getBackendURL().replace(/\/$/, '')}/api/v1/users/refresh-token`;

                // Используем правильный эндпоинт
                const res = await axios.post(refreshURL, {
                    refresh_token: refreshToken,
                });

                const newToken = res.data.data.access_token;
                const newRefreshToken = res.data.data.refresh_token;
                
                // Сохраняем токены в куки (синхронная операция)
                createCookies('token', newToken);
                createCookies('refresh_token', newRefreshToken);
                
                // Обрабатываем очередь ожидающих запросов с новым токеном
                // Все запросы в очереди получат новый токен через processQueue
                processQueue(null, newToken);
                
                // КРИТИЧНО: Создаем новый объект конфигурации с явно установленным заголовком
                // Это гарантирует, что новый токен будет использоваться, даже если axios клонирует объект
                const retryConfig = {
                    ...originalRequest,
                    _retry: true, // Помечаем, что это повторный запрос
                    headers: {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${newToken}`, // Явно устанавливаем новый токен
                    },
                };
                
                // Убеждаемся, что заголовок установлен (на случай, если headers был undefined)
                if (!retryConfig.headers) {
                    retryConfig.headers = {};
                }
                retryConfig.headers.Authorization = `Bearer ${newToken}`;
                
                // Повторяем оригинальный запрос с новым токеном через наш http экземпляр
                // Request interceptor проверит _retry флаг и не будет перезаписывать заголовок
                return http(retryConfig);
            } catch (refreshErr) {
                console.error(
                    '❌ Token refresh failed:',
                    refreshErr.response?.data || refreshErr.message
                );
                processQueue(refreshErr, null);
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default http;

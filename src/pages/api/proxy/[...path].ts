import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Получаем путь из query параметров
    const { path } = req.query;
    
    // Формируем полный URL к бэкенду
    // path будет массивом типа ['api', 'v1', 'users', 'register']
    // Передаем весь путь как есть к бэкенду
    const pathString = Array.isArray(path) ? path.join('/') : path || '';
    const backendPath = pathString ? `/${pathString}` : '';
    
    // Убираем trailing slash из BACKEND_URL
    const backendURLFixed = BACKEND_URL.replace(/\/$/, '');
    const url = `${backendURLFixed}${backendPath}`;
    
    // Получаем query параметры (кроме path)
    const queryParams = new URLSearchParams();
    Object.keys(req.query).forEach((key) => {
        if (key !== 'path') {
            const value = req.query[key];
            if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, v));
            } else if (value) {
                queryParams.append(key, value as string);
            }
        }
    });
    
    const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    
    try {
        // Получаем заголовки из запроса
        const headers: Record<string, string> = {};
        
        // Копируем Authorization заголовок, если он есть
        if (req.headers.authorization) {
            headers.Authorization = req.headers.authorization;
        }
        
        // Копируем Content-Type заголовок
        if (req.headers['content-type']) {
            headers['Content-Type'] = req.headers['content-type'] as string;
        } else if (req.method !== 'GET' && req.method !== 'HEAD') {
            headers['Content-Type'] = 'application/json';
        }
        
        // Подготавливаем тело запроса
        let body: string | undefined = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            if (req.body) {
                // Если тело уже распарсено Next.js, преобразуем в JSON
                if (typeof req.body === 'string') {
                    body = req.body;
                } else {
                    body = JSON.stringify(req.body);
                }
            }
        }
        
        // Делаем запрос к бэкенду
        const response = await fetch(fullUrl, {
            method: req.method,
            headers,
            body,
        });
        
        // Получаем данные ответа
        const data = await response.text();
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch {
            jsonData = data;
        }
        
        // Копируем статус и заголовки ответа
        res.status(response.status);
        
        // Копируем важные заголовки
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
        
        // Копируем CORS заголовки, если они есть
        const accessControlAllowOrigin = response.headers.get('access-control-allow-origin');
        if (accessControlAllowOrigin) {
            res.setHeader('Access-Control-Allow-Origin', accessControlAllowOrigin);
        }
        
        // Отправляем ответ
        if (typeof jsonData === 'object') {
            res.json(jsonData);
        } else {
            res.send(jsonData);
        }
    } catch (error: any) {
        console.error('Proxy error:', error);
        console.error('Request URL:', fullUrl);
        console.error('Request method:', req.method);
        console.error('Request body:', req.body);
        res.status(500).json({ 
            message: 'Proxy error', 
            error: error.message || 'Internal server error',
            url: fullUrl
        });
    }
}


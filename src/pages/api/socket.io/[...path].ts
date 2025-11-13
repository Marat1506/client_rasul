import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// Отключаем автоматический парсинг тела для Socket.IO
// Socket.IO polling может отправлять данные в разных форматах
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Получаем путь из query параметров
    const { path } = req.query;
    
    // Формируем путь для Socket.IO
    // path будет массивом типа ['socket.io']
    const pathString = Array.isArray(path) ? path.join('/') : path || 'socket.io';
    
    // Убираем trailing slash из BACKEND_URL
    const backendURLFixed = BACKEND_URL.replace(/\/$/, '');
    
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
    
    const url = `${backendURLFixed}/${pathString}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
        // Получаем заголовки из запроса
        const headers: Record<string, string> = {};
        
        // Копируем все важные заголовки для Socket.IO
        if (req.headers['content-type']) {
            headers['Content-Type'] = req.headers['content-type'] as string;
        }
        if (req.headers['accept']) {
            headers['Accept'] = req.headers['accept'] as string;
        }
        if (req.headers['origin']) {
            headers['Origin'] = req.headers['origin'] as string;
        }
        if (req.headers['referer']) {
            headers['Referer'] = req.headers['referer'] as string;
        }
        
        // Копируем cookie для аутентификации
        if (req.headers.cookie) {
            headers['Cookie'] = req.headers.cookie;
        }
        
        // Для Socket.IO polling нужно правильно обработать тело запроса
        // Next.js уже парсит тело, но Socket.IO может отправлять данные в разных форматах
        let body: string | undefined = undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            if (typeof req.body === 'string') {
                body = req.body;
            } else if (req.body !== null && req.body !== undefined) {
                // Если это объект, преобразуем в строку
                // Socket.IO polling обычно использует plain text или JSON
                const contentType = req.headers['content-type'] || '';
                if (contentType.includes('application/json')) {
                    body = JSON.stringify(req.body);
                } else {
                    // Для других форматов пробуем преобразовать в строку
                    body = String(req.body);
                }
            }
        }
        
        // Делаем запрос к бэкенду
        const response = await fetch(url, {
            method: req.method,
            headers,
            body,
        });
        
        // Получаем данные ответа
        const data = await response.text();
        
        // Копируем статус и заголовки ответа
        res.status(response.status);
        
        // Копируем важные заголовки для Socket.IO
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }
        
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        
        // Отправляем ответ
        res.send(data);
    } catch (error: any) {
        console.error('Socket.IO proxy error:', error);
        res.status(500).json({ 
            message: 'Socket.IO proxy error', 
            error: error.message || 'Internal server error' 
        });
    }
}


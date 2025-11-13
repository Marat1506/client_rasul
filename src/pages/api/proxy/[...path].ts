import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// Отключаем автоматический парсинг тела для multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

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
        
        // Копируем Content-Type заголовок (важно для multipart/form-data)
        if (req.headers['content-type']) {
            headers['Content-Type'] = req.headers['content-type'] as string;
        }
        
        // Копируем другие важные заголовки
        if (req.headers['user-agent']) {
            headers['User-Agent'] = req.headers['user-agent'] as string;
        }
        
        // Обрабатываем тело запроса
        let body: string | Buffer | undefined = undefined;
        
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            // Если это multipart/form-data, читаем тело как stream
            if (req.headers['content-type']?.includes('multipart/form-data')) {
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                    chunks.push(chunk);
                }
                if (chunks.length > 0) {
                    body = Buffer.concat(chunks);
                }
            } else {
                // Для JSON и других типов читаем как текст
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                    chunks.push(chunk);
                }
                if (chunks.length > 0) {
                    body = Buffer.concat(chunks).toString();
                    // Если это JSON, парсим и отправляем как JSON
                    if (req.headers['content-type']?.includes('application/json')) {
                        try {
                            const jsonData = JSON.parse(body as string);
                            body = JSON.stringify(jsonData);
                        } catch {
                            // Если не JSON, оставляем как есть
                        }
                    }
                }
            }
        }
        
        // Делаем запрос к бэкенду
        const response = await fetch(fullUrl, {
            method: req.method,
            headers,
            body: body as any,
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
        
        // Отправляем ответ
        if (typeof jsonData === 'object') {
            res.json(jsonData);
        } else {
            res.send(jsonData);
        }
    } catch (error: any) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            message: 'Proxy error', 
            error: error.message || 'Internal server error' 
        });
    }
}


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
            // Читаем тело запроса как Buffer (сохраняет multipart boundary)
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }
            if (chunks.length > 0) {
                const buffer = Buffer.concat(chunks);
                
                // Для multipart/form-data передаем Buffer как есть
                if (req.headers['content-type']?.includes('multipart/form-data')) {
                    body = buffer;
                } else {
                    // Для JSON и других типов конвертируем в строку
                    body = buffer.toString();
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
        
        // Логируем для отладки (только для файловых запросов)
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            console.log('File upload request:', {
                method: req.method,
                url: fullUrl,
                contentType: req.headers['content-type'],
                bodySize: body ? (body instanceof Buffer ? body.length : 0) : 0,
                hasAuth: !!headers.Authorization
            });
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
        
        // Логируем ошибки
        if (response.status >= 400) {
            console.error('Backend error:', {
                status: response.status,
                url: fullUrl,
                method: req.method,
                response: data.substring(0, 500) // Первые 500 символов
            });
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
        console.error('Proxy error:', {
            message: error.message,
            stack: error.stack,
            url: fullUrl,
            method: req.method
        });
        res.status(500).json({ 
            message: 'Proxy error', 
            error: error.message || 'Internal server error' 
        });
    }
}


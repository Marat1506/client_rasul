import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// Этот route обрабатывает запросы к /api
// Если это запрос Socket.IO (с параметрами EIO и transport), проксируем на бэкенд
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Проверяем, является ли это запросом Socket.IO
    const isSocketIORequest = req.query.EIO !== undefined || req.query.transport !== undefined;
    
    if (isSocketIORequest) {
        // Проксируем запрос напрямую на бэкенд Socket.IO
        const backendURLFixed = BACKEND_URL.replace(/\/$/, '');
        
        // Получаем query параметры
        const queryParams = new URLSearchParams();
        Object.keys(req.query).forEach((key) => {
            const value = req.query[key];
            if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, v));
            } else if (value) {
                queryParams.append(key, value as string);
            }
        });
        
        const queryString = queryParams.toString();
        // Socket.IO использует путь /socket.io/
        const url = `${backendURLFixed}/socket.io${queryString ? `?${queryString}` : ''}`;
        
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
            let body: string | undefined = undefined;
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                // Читаем тело запроса как stream
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                    chunks.push(chunk);
                }
                if (chunks.length > 0) {
                    body = Buffer.concat(chunks).toString();
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
            
            // Копируем CORS заголовки
            const accessControlAllowOrigin = response.headers.get('access-control-allow-origin');
            if (accessControlAllowOrigin) {
                res.setHeader('Access-Control-Allow-Origin', accessControlAllowOrigin);
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
    } else {
        res.status(404).json({ message: 'Not found' });
    }
}


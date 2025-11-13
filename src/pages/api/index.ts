import type { NextApiRequest, NextApiResponse } from 'next';

// Этот route обрабатывает запросы к /api
// Если это запрос Socket.IO (с параметрами EIO и transport), перенаправляем на /api/socket.io
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Проверяем, является ли это запросом Socket.IO
    const isSocketIORequest = req.query.EIO !== undefined || req.query.transport !== undefined;
    
    if (isSocketIORequest) {
        // Перенаправляем на /api/socket.io
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
        const redirectUrl = `/api/socket.io${queryString ? `?${queryString}` : ''}`;
        
        // Делаем внутренний редирект через fetch
        try {
            const protocol = req.headers['x-forwarded-proto'] || 'https';
            const host = req.headers.host;
            const fullUrl = `${protocol}://${host}${redirectUrl}`;
            
            const response = await fetch(fullUrl, {
                method: req.method,
                headers: {
                    ...Object.fromEntries(
                        Object.entries(req.headers).filter(([key]) => 
                            !['host', 'x-forwarded-proto', 'x-forwarded-for'].includes(key.toLowerCase())
                        )
                    ) as Record<string, string>,
                },
                body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
            });
            
            const data = await response.text();
            res.status(response.status);
            
            const contentType = response.headers.get('content-type');
            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            
            res.send(data);
        } catch (error: any) {
            console.error('Redirect error:', error);
            res.status(500).json({ 
                message: 'Redirect error', 
                error: error.message || 'Internal server error' 
            });
        }
    } else {
        res.status(404).json({ message: 'Not found' });
    }
}


import type { NextApiRequest, NextApiResponse } from 'next';

// Используем NEXT_PUBLIC_BASE_URL (доступна и в серверных функциях)
// В Vercel переменные окружения доступны через process.env
const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BACKEND_URL || 'http://localhost:3001';

// Логируем доступные переменные окружения (только в development)
if (process.env.NODE_ENV !== 'production') {
    console.log('Environment variables:', {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        BACKEND_URL: process.env.BACKEND_URL,
        NODE_ENV: process.env.NODE_ENV
    });
}

// Прокси для загрузки изображений из uploads директории бэкенда
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Логируем все запросы для отладки
    console.log('=== UPLOADS PROXY REQUEST ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Query:', req.query);
    console.log('BACKEND_URL:', BACKEND_URL);
    
    // Получаем путь к файлу из query параметров
    // В catch-all route path будет массивом, например ['1763004166050-r878684q6v.jpg']
    const { path } = req.query;
    
    // Формируем путь к файлу
    const pathString = Array.isArray(path) ? path.join('/') : (path || '');
    
    if (!pathString) {
        res.status(400).json({ message: 'File path is required' });
        return;
    }
    
    // Убираем ведущий слэш, если есть
    let filePath = pathString.startsWith('/') ? pathString.substring(1) : pathString;
    
    // Если путь уже начинается с uploads/, убираем его, так как мы добавим его в URL
    if (filePath.startsWith('uploads/')) {
        filePath = filePath.substring('uploads/'.length);
    }
    
    // Формируем URL к бэкенду
    const backendURLFixed = BACKEND_URL.replace(/\/$/, '');
    const url = `${backendURLFixed}/uploads/${filePath}`;
    
    console.log('Uploads proxy request:', {
        originalPath: path,
        pathString,
        filePath,
        url,
        backendURL: BACKEND_URL,
        method: req.method,
        query: req.query
    });
    
    try {
        // Делаем запрос к бэкенду для получения изображения
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Next.js-Proxy/1.0',
            },
        });
        
        console.log('Backend response:', {
            status: response.status,
            statusText: response.statusText,
            url,
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length')
        });
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            console.error('Failed to fetch file:', {
                status: response.status,
                statusText: response.statusText,
                url,
                errorText: errorText.substring(0, 200)
            });
            res.status(response.status).json({ 
                message: 'File not found',
                error: `Failed to fetch file: ${response.statusText}`,
                url
            });
            return;
        }
        
        // Получаем данные изображения
        const buffer = await response.arrayBuffer();
        const data = Buffer.from(buffer);
        
        // Определяем Content-Type из ответа бэкенда или по расширению файла
        let contentType = response.headers.get('content-type') || 'image/jpeg';
        const ext = filePath.split('.').pop()?.toLowerCase();
        if (!contentType || contentType === 'application/octet-stream') {
            const mimeTypes: Record<string, string> = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp',
                'mp4': 'video/mp4',
                'webm': 'video/webm',
            };
            contentType = mimeTypes[ext || ''] || 'image/jpeg';
        }
        
        // Копируем статус и заголовки ответа
        res.status(response.status);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        
        // Отправляем данные изображения
        res.send(data);
    } catch (error: any) {
        console.error('Uploads proxy error:', {
            message: error.message,
            stack: error.stack,
            url,
            filePath
        });
        res.status(500).json({ 
            message: 'Failed to fetch file', 
            error: error.message || 'Internal server error' 
        });
    }
}


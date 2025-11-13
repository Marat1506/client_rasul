import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// Прокси для загрузки изображений из uploads директории бэкенда
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Получаем путь к файлу из query параметров
    const { path } = req.query;
    
    // Формируем путь к файлу
    const pathString = Array.isArray(path) ? path.join('/') : path || '';
    
    // Убираем ведущий слэш, если есть
    const filePath = pathString.startsWith('/') ? pathString.substring(1) : pathString;
    
    // Формируем URL к бэкенду
    const backendURLFixed = BACKEND_URL.replace(/\/$/, '');
    const url = `${backendURLFixed}/uploads/${filePath}`;
    
    try {
        // Делаем запрос к бэкенду для получения изображения
        const response = await fetch(url, {
            method: 'GET',
        });
        
        if (!response.ok) {
            res.status(response.status).json({ 
                message: 'File not found',
                error: `Failed to fetch file: ${response.statusText}`
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


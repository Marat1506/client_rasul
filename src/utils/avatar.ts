/**
 * Утилита для получения полного URL аватара
 * @param avatarPath - путь к аватару (может быть относительным или полным URL)
 * @returns полный URL для доступа к аватару
 */
export const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
    if (!avatarPath) return null;
    
    // Определяем, находимся ли мы в продакшене (HTTPS)
    const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';
    
    // Если уже полный URL (начинается с http/https), в продакшене нужно использовать прокси
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        if (isProduction && avatarPath.startsWith('http://')) {
            // В продакшене HTTP URL нужно проксировать через Next.js API
            // Извлекаем путь из URL (например, http://31.57.228.116/uploads/file.jpg -> /uploads/file.jpg)
            const url = new URL(avatarPath);
            return `/api/uploads${url.pathname}`;
        }
        return avatarPath;
    }
    
    // Если относительный путь (начинается с /)
    if (avatarPath.startsWith('/')) {
        if (isProduction) {
            // В продакшене используем прокси через Next.js API
            return `/api/uploads${avatarPath}`;
        }
        // В разработке используем прямой URL к бэкенду
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        return `${baseURL}${avatarPath}`;
    }
    
    // Иначе считаем относительным путем
    if (isProduction) {
        // В продакшене используем прокси
        return `/api/uploads/${avatarPath}`;
    }
    // В разработке используем прямой URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    return `${baseURL}/${avatarPath}`;
};


/**
 * Утилита для получения полного URL аватара
 * @param avatarPath - путь к аватару (может быть относительным или полным URL)
 * @returns полный URL для доступа к аватару
 */
export const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
    if (!avatarPath) return null;
    
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    
    // Если уже полный URL (начинается с http), возвращаем как есть
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }
    
    // Если относительный путь (начинается с /), добавляем baseURL
    if (avatarPath.startsWith('/')) {
        return `${baseURL}${avatarPath}`;
    }
    
    // Иначе считаем относительным путем и добавляем baseURL
    return `${baseURL}/${avatarPath}`;
};


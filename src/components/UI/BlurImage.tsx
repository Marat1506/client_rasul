import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';

// mui
export default function BlurImage({ ...props }) {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const src = props?.src || null;
  
  // Отключаем оптимизацию для:
  // - HTTP/HTTPS URLs (внешние ресурсы)
  // - Путей начинающихся с /uploads/ (старые пути)
  // - Путей начинающихся с /api/uploads/ (наш прокси)
  const shouldUnoptimize = 
    !src || 
    typeof src !== 'string' ||
    src.startsWith('http://') || 
    src.startsWith('https://') || 
    src.startsWith('/uploads/') ||
    src.startsWith('/api/uploads/');
  
  return (
    <Image
      sizes={isDesktop ? '14vw' : '50vw'}
      {...props}
      src={src}
      alt={props.alt}
      unoptimized={shouldUnoptimize}
    />
  );
} 

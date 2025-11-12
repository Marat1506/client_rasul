import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';

// mui
export default function BlurImage({ ...props }) {
  const isDesktop = useMediaQuery('(min-width:600px)');
  return (
    <Image
      sizes={isDesktop ? '14vw' : '50vw'}
      {...props}
      src={props?.src || null}
      alt={props.alt}
      unoptimized={props?.src?.startsWith('http://') || props?.src?.startsWith('https://') || props?.src?.startsWith('/uploads/')}
    />
  );
} 

import Image from 'next/image';

import styles from './ResponseiveImage.module.scss';

export const ResponsiveImage = ({
  src,
  alt = 'alt',
}: {
  src: any;
  alt: string;
}) => {
  return (
    <div className={styles.heroImage}>
      <Image
        alt={alt}
        className={styles.image}
        fill 
        priority
        src={src || null}
      />
    </div>
  );
};

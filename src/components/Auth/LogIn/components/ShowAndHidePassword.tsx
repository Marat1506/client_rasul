import { FC } from 'react';

import { Box } from '@mui/material';
import Image from 'next/image';
interface ShowAndHidePasswordProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}
const ShowAndHidePassword: FC<ShowAndHidePasswordProps> = ({
  isVisible,
  setIsVisible,
}) => {
  return (
    <Box
      onClick={() => setIsVisible(!isVisible)}
      position={'absolute'} 
      right={16}
      top={18}
      width={32}
      height={32}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {isVisible ? (
        <Image src={'/images/eye_show.svg'} alt="" width={24} height={24} />
      ) : (
        <Image src={'/images/eye_hide.svg'} alt="" width={24} height={24} />
      )}
    </Box>
  );
};

export default ShowAndHidePassword;

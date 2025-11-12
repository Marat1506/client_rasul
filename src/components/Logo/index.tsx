import React from 'react';

import {useRouter} from 'next/router';

import BlurImage from '@/components/UI/BlurImage';

import LogoIcon from '@/../public/logo.svg';

const Logo = () => {
    const router = useRouter();
    return (<BlurImage onClick={() => router.push('/')} width={180} height={40} src={LogoIcon.src} alt="logo"/>);
}; 

export default Logo;
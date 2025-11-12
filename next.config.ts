import type {NextConfig} from 'next';

import withTM from 'next-transpile-modules';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    typescript: {
        // Отключаем проверку типов во время билда
        ignoreBuildErrors: true,
    },
    eslint: {
        // Отключаем ESLint во время билда
        ignoreDuringBuilds: true,
    },
    env: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
        NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
        NEXT_PUBLIC_CAPTCHA_SECRET_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SECRET_KEY,
        NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
        NEXT_PUBLIC_GOOGLE_VERIFY_URL: process.env.NEXT_PUBLIC_GOOGLE_VERIFY_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/uploads/**',
            },
        ],
    },

    transpilePackages: [
        '@mui/material',
        '@mui/system',
        '@emotion/react',
        '@emotion/styled',
        '@mui/icons-material',
        'cyrillic-slug',
        'react-google-recaptcha',
        'numeral',
    ],
};

export default nextConfig;

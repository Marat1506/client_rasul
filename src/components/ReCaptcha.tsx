import { useState } from 'react';

import { Box } from '@mui/system';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import Api from '../services';

const SITE_KEY = '6LfqGskqAAAAAIidzBWGoCtUdszB1hHZOX88aTlG';

export default function ContactPage({ onVerify }: { onVerify: (token: string | null) => void }) {
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleVerify = async (token: string | null) => {
        if (!token) return;

        setTimeout(() => {
            setCaptchaVerified(true);
            onVerify(token);
        }, 1000);

        try {
            const data = await Api.captcha(token);

            // if (data) {
            //     setCaptchaVerified(true);
            //     onVerify(token);
            // } else {
            //     console.error("Captcha validation failed:", data);
            // }
        } catch (error) {
            console.error('Error verifying captcha:', error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999
            }}
        >
            <ReCAPTCHA
                sitekey={SITE_KEY}
                onChange={handleVerify}
            />
        </Box>
    );
}
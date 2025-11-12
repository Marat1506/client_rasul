import type { NextApiRequest, NextApiResponse } from 'next';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { token } = req.body;

    const googleVerifyUrl = process.env.NEXT_PUBLIC_GOOGLE_VERIFY_URL;
    const googleVerifyParams = new URLSearchParams({
        secret: SECRET_KEY,
        response: token,
    }); 

    try {
        const response = await fetch(`${googleVerifyUrl}?${googleVerifyParams}`, {
            method: 'POST',
        });
        const data = await response.json();

        if (data.success) {
            return res.status(200).json({ message: 'Captcha verified successfully' });
        } else {
            return res.status(400).json({ message: 'Captcha verification failed' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

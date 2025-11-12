import React, {useEffect, useState} from 'react';

import {Box} from '@mui/system';
import {useRouter} from 'next/router';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const Recover = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const step = urlParams.get('step');

        if (!step) { 
            router.push({
                pathname: router.pathname,
                query: {...router.query, step: 1}
            });
        }

        if (step) setCurrentStep(Number(step));

    }, [router]);

    return (
        <Box>
            {currentStep === 1 && <Step1/>}
            {currentStep === 2 && <Step2/>}
            {currentStep === 3 && <Step3/>}
        </Box>
    );
};

export default Recover;

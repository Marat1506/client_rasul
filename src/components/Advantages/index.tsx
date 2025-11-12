import React, {useEffect} from 'react';

import {Skeleton, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useSelector} from 'react-redux';

import useAppDispatch from '@/hooks/useAppDispatch';
import {RootState} from '@/redux';
import {advantages} from '@/redux/actions/contents';
import {createGradient} from '@/theme/palette';

import styles from './Advantages.module.scss';

const Advantages = () => {
    const firstHalf = [
        'Data Loss',
        'Network Infrastructure Failure',
        'End User Device Failure',
        'Unauthorized Access to Information',
        'Information Theft', 
        'Operating System Failure',
        'Website Failure',
        'Budget Failure'
    ];

    const secondHalf = [
        'Failure',
        'Database Failure',
        'Power Failure',
        'CRM System Failure',
        'ERP System Failure',
        'DDoS Attack',
        'Malware',
        'Process Failure'
    ];

    return (
        <Box mt={15} mb={15}>
            <Typography className={styles.title} fontWeight={600} color={'primary'} component="h2" variant="h2">
                What threats can we protect against?
            </Typography>

            <Box mt={1} className={styles.advantages_list}>
                {firstHalf.map((item: any, i: number) => (
                    <Box
                        key={i}
                        className={styles.advantages}
                        sx={{
                            background: (theme) => createGradient(theme.palette.primary.dark, theme.palette.primary.main),
                            borderRadius: (theme) => theme.shape.borderRadius,
                        }}
                    >
                        <Typography fontWeight={500} color={'white'} component="h5" variant="subtitle1">
                            {item}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box mt={1} className={styles.advantages_list}>
                {secondHalf.map((item: any, i: number) => (
                    <Box
                        key={i}
                        className={styles.advantages}
                        sx={{
                            background: (theme) => createGradient(theme.palette.primary.dark, theme.palette.primary.main),
                            borderRadius: (theme) => theme.shape.borderRadius,
                        }}
                    >
                        <Typography fontWeight={500} color={'white'} component="h5" variant="subtitle1">
                            {item}
                        </Typography>
                    </Box>
                ))}
            </Box>

        </Box>
    );
};

export default Advantages;

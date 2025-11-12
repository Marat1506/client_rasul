import React, { useEffect, useState, useRef } from 'react';

import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

import {RootState} from '@/redux';

import LogInComponent from '../../../components/Auth/LogIn';


const LogIn = () => {
    const router = useRouter();
    const {isAuthorization} = useSelector((state: RootState) => state.auth);
    const [mounted, setMounted] = useState(false);
    const isRedirectingRef = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isAuthorization && mounted && !isRedirectingRef.current) {
            isRedirectingRef.current = true;
            
            // Используем requestAnimationFrame и setTimeout для отложенной навигации
            // Это предотвращает ошибки removeChild при размонтировании компонентов
            let timeoutId: NodeJS.Timeout | null = null;
            let cancelled = false;
            
            const frameId = requestAnimationFrame(() => {
                if (cancelled) return;
                
                timeoutId = setTimeout(() => {
                    if (!cancelled) {
                        // Используем window.location.href для полной перезагрузки страницы
                        window.location.href = '/';
                    }
                }, 100);
            });
            
            return () => {
                cancelled = true;
                cancelAnimationFrame(frameId);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
    }, [isAuthorization, mounted]);

    // Не рендерим компонент, если пользователь авторизован
    if (isAuthorization) {
        return null;
    }

    return (
       <LogInComponent/>
    );
};
 
export default LogIn;
import React, {useState, useEffect, useRef} from 'react';

import {alpha, useTheme} from '@mui/material/styles';
import {Box} from '@mui/system';
import {motion, AnimatePresence} from 'framer-motion';
import {useSelector} from 'react-redux';

import BlurImage from '@/components/UI/BlurImage';
import MenuContent from '@/layout/Menu/MenuContent';
import {RootState} from '@/redux';
import {getAvatarUrl} from '@/utils/avatar';

import styles from './Menu.module.scss';
import menuclose from '../../../public/images/menuclose.svg';
import menuopen from '../../../public/images/menuopen.svg';
import avatar from '../../../public/images/user.svg';


const Menu: React.FC = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const {user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Box
            ref={menuRef}
            className={styles.Menu}
            sx={{background: (theme) => theme.palette.background.paper}}
        >
            {mounted ? (
                <BlurImage
                    className={styles.avatar}
                    src={user?.avatar ? getAvatarUrl(user.avatar) : avatar?.src}
                    alt="user"
                    width={30}
                    height={30}
                />
            ) : (
                <Box
                    className={styles.avatar}
                    width={30}
                    height={30}
                    borderRadius="50%"
                    bgcolor="grey.300"
                    sx={{ flexShrink: 0 }}
                />
            )}

            <Box className={styles.burger} onClick={handleClick}>
                {!isOpen ? (
                    <BlurImage src={menuopen.src} alt="icon" width={16} height={16}/>
                ) : (
                    <BlurImage src={menuclose.src} alt="icon" width={16} height={16}/>
                )}
            </Box>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        style={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${alpha(theme.palette.grey[900], 0.3)}`,
                        }}
                        className={styles.modal}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                        }}
                    >
                        <MenuContent setIsOpen={setIsOpen}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default Menu;
import {GlobalStyles as GlobalThemeStyles} from '@mui/material';
import {useTheme, alpha} from '@mui/material/styles';

import {createGradient} from './palette';

export default function GlobalStyles() {
    const theme = useTheme();

    return (
        <GlobalThemeStyles
            styles={{
                '*': {
                    textDecoration: 'none',
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                }, 
                html: {
                    width: '100%',
                    height: '100%',
                    WebkitOverflowScrolling: 'touch',
                },
                body: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.palette.background.default,
                    fontFamily: 'Onest, Arial, sans-serif',
                },
                '::-webkit-scrollbar': {
                    width: 8,
                    height: 8,
                },
                '::-webkit-scrollbar-track': {
                    boxShadow: 'inset 0 0 1px grey!important',
                    background: 'transparent',
                },
                '::-webkit-scrollbar-thumb': {
                    background: theme.palette.primary.main,
                    borderRadius: '4px!important',
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: theme.palette.primary.dark,
                },
                '#__next': {
                    width: '100%',
                    height: '100%',
                },
                input: {
                    fontSize: '16px',
                    '&[type=number]': {
                        MozAppearance: 'textfield',
                        '&::-webkit-outer-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none'
                        },
                        '&::-webkit-inner-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none'
                        }
                    }
                },

                textarea: {
                    fontSize: '16px',
                },


                '@media screen and (max-width: 767px)': {
                    input: {
                        fontSize: '16px !important',
                    },
                    textarea: {
                        fontSize: '16px !important',
                    },
                    select: {
                        fontSize: '16px !important',
                    },
                    button: {
                        fontSize: '16px !important',
                    }
                }
            }}
        />
    );
}

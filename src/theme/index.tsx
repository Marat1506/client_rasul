import React from 'react';
import {useMemo, useState, useEffect} from 'react';

import {CssBaseline} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import palette from './palette';
import shadows from './shadows';
import shape from './shape';
import typography from './typography';
import '@fontsource/onest/400.css';
import '@fontsource/onest/500.css';
import '@fontsource/onest/600.css';


function ThemeConfig({children}: any) {
    const [mode, setMode] = useState(null);
    const isDark = mode === 'dark';


    const themeWithLocale = useMemo(
        () => 
            createTheme(
                {
                    palette: isDark
                        ? {...palette.dark, mode: 'dark'}
                        : {...palette.light, mode: 'light'},
                    shape,
                    typography: {
                        ...typography,
                        fontFamily: 'Onest, Arial, sans-serif',
                        fontWeightRegular: 400,
                        fontWeightMedium: 500,
                        fontWeightBold: 600,
                        color: '#000000'
                    },
                    breakpoints,
                    shadows: isDark ? shadows.dark : shadows.light,
                    components: componentsOverride(createTheme())
                },
            ),
        [isDark, mode]
    );

    // useEffect(() => {
    //   setMode(themeMode);
    // }, [themeMode]);

    themeWithLocale.components = componentsOverride(themeWithLocale);

    return (
        <ThemeProvider theme={themeWithLocale}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    );
}

export default ThemeConfig;

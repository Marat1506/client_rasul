export default function componentsOverride(theme: any) {
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                    '&.MuiButton-sizeMedium': {
                        height: 40,
                    }, 
                    '&.MuiButton-sizeSmall': {
                        height: 32,
                    },
                },
                sizeLarge: {
                    height: 48,
                },
                // contained styles
                containedInherit: {
                    color: theme.palette.grey[800],
                    '&:hover': {
                        backgroundColor: theme.palette.grey[400],
                    },
                },
                containedPrimary: {
                    // Customize boxShadow or other properties as needed
                },
                containedSecondary: {
                    // Customize boxShadow or other properties as needed
                },
                containedInfo: {
                    // Customize boxShadow or other properties as needed
                },
                containedSuccess: {
                    // Customize boxShadow or other properties as needed
                },
                containedWarning: {
                    // Customize boxShadow or other properties as needed
                },
                containedError: {
                    // Customize boxShadow or other properties as needed
                },
                // outlined styles
                outlinedInherit: {
                    border: `1px solid ${theme.palette.grey[500_32]}`,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
                textInherit: {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
            },
        },
    };
}

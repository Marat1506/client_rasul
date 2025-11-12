export default function Card(theme: any) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    position: 'relative',
                    zIndex: 0,
                    // boxShadow: "0px 10px 32px -4px rgba(19, 25, 39, 0.10), 0px 6px 14px -6px rgba(19, 25, 39, 0.12)",
                    transition: 'all ease-in-out 0.3s',
                    background: theme.palette.background.paper,
                },
            },
        },
        MuiCardHeader: { 
            defaultProps: {
                titleTypographyProps: {variant: 'h6'},
                subheaderTypographyProps: {
                    variant: 'body2',
                    marginTop: theme.spacing(0.5),
                },
            },
            styleOverrides: {
                root: {
                    padding: theme.spacing(3, 3, 0),
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: theme.spacing(3),
                },
            },
        },
    };
}

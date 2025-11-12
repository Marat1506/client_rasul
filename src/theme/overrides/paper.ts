export default function Paper(theme: any) {
    return {
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },

            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: theme.shape.borderRadius,
                    padding: theme.shape.padding,
                }, 
            },
        },
    };
}
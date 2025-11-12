export default function Input(theme: any) {
    return {
        MuiInputBase: {
            styleOverrides: {
                root: {

                    borderRadius: theme.shape.borderRadius,
                    background: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '&.Mui-disabled': {
                        '& svg': {color: theme.palette.text.disabled}
                    }
                },
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: theme.palette.primary.contrastText
                    }
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                underline: {
                    '&:before': {
                        borderBottomColor: theme.palette.grey[500_56]
                    }
                }
            }
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.grey[500_12],
                    '&:hover': {
                        backgroundColor: theme.palette.grey[500_16]
                    },
                    '&.Mui-focused': {
                        backgroundColor: theme.palette.action.focus
                    },
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.action.disabledBackground
                    }
                },
                underline: {
                    '&:before': {
                        borderBottomColor: theme.palette.grey[500_56]
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.grey[500_32]
                    },
                    '&.Mui-disabled': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.action.disabledBackground
                        }
                    }
                }
            }
        }
    };
}

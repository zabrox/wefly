import { createTheme, ThemeProvider } from '@mui/material/styles';
import { cyan } from '@mui/material/colors';

export const primaryColor = cyan[500];

const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
            contrastText: '#fff',
        },
    }
});

export const ColorTheme = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
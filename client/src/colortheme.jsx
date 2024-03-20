import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';

export const primaryColor = deepOrange[500];
export const secondaryColor = '#fff';

const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
            contrastText: secondaryColor,
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
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const ProgressBar = ({ show, controlPanelSize }) => {
    return (
        <Box sx={{
            position: 'absolute',
            display: show ? 'inline-flex': 'none',
            left: (controlPanelSize / 2) - 20,
            top: '40%'}} >
            <CircularProgress variant='indeterminate' />
        </Box>
    );
}
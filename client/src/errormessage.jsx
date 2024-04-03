import { Snackbar, Alert } from '@mui/material';

export const ErrorMessage = ({ state, setState }) => {
    return (
        <Snackbar open={state.errorMessage !== ''}
            onClose={() => setState({ ...state, errorMessage: '' })}
            autoHideDuration={3000}>
            <Alert severity='error'>{state.errorMessage}</Alert>
        </Snackbar>
    );
}
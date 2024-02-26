import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function TracksLoadingDialog({ open }) {
    return (
        <Dialog open={open} aria-labelledby="loading-dialog-title">
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    p={1}
                >
                    <CircularProgress />
                    <Typography variant="subtitle1" mt={2} style={{paddingLeft: '20px'}}>
                        トラックの読み込み中...
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

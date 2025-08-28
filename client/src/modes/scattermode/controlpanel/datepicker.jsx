import React from 'react';
import { Box } from '@mui/system';
import { MobileDatePicker } from '@mui/x-date-pickers';
import './datepicker.css';

export const DatePicker = ({ date, handleDateChange, label }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Box id='date-picker-container'>
            <MobileDatePicker id='mobile-date-picker'
                label={label}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                slotProps={{
                    toolbar: {
                        toolbarFormat: 'YYYY-MM-DD (ddd)',
                        hidden: false,
                    },
                    actionBar: {
                        actions: ['cancel', 'today'],
                    },
                    textField: {
                        onClick: () => setOpen(true),
                        readOnly: true,
                    },
                }}
                value={date}
                format="YYYY-MM-DD (ddd)"
                onChange={(newDate) => {
                    if (newDate) {
                        handleDateChange(newDate);
                        setOpen(false);
                    }
                }}
            />
        </Box>
    );
}

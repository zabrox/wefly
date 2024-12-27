import { Box } from '@mui/system';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { MobileDatePicker } from '@mui/x-date-pickers';
import './datepicker.css';

export const DatePicker = ({ date, handleDateChange, handleTodayIconClick, showTodayButton }) => {
    return (
        <Box id='date-picker-container'>
            <MobileDatePicker id='mobile-date-picker'
                slotProps={{
                    toolbar: {
                        toolbarFormat: 'YYYY-MM-DD (ddd)',
                        hidden: false,
                    },
                }}
                value={date}
                format="YYYY-MM-DD (ddd)"
                onAccept={handleDateChange} />
            {showTodayButton ?
                <UpcomingIcon id='todayicon'
                    onClick={handleTodayIconClick} /> : null}
        </Box>
    );
}

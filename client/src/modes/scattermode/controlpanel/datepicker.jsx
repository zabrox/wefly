import { Box } from '@mui/system';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { MobileDatePicker } from '@mui/x-date-pickers';

export const DatePicker = ({ searchCondition, handleDateChange, handleTodayIconClick }) => {
    return (
        <Box id='date-picker-container'>
            <MobileDatePicker
                value={searchCondition.from}
                format="YYYY-MM-DD (ddd)"
                onAccept={handleDateChange} />
            <UpcomingIcon id='todayicon'
                onClick={handleTodayIconClick} />
        </Box>
    );
}

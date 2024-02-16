import { Avatar } from '@mui/material';

export const PilotIcon = ({ track }) => {
    const iconUrl = (track) => {
        return `${import.meta.env.VITE_API_URL}/track/piloticon?pilotname=${track.metadata.pilotname}`;
    }
    return (
        <Avatar className='piloticon' src={iconUrl(track)} sx={{ width: '32px', height: '32px' }} />
    );
}
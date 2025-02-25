import { Avatar } from '@mui/material';

export const PilotIcon = ({ track, size }) => {
    const iconUrl = (track) => {
        return `${import.meta.env.VITE_API_URL}api/track/piloticon?pilotname=${track.metadata.pilotname}`;
    }
    return (
        <Avatar className='piloticon' src={iconUrl(track)}
            sx={{ width: size, height: size, borderRadius: '50%'}} />
    );
}
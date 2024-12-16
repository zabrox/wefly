import React from 'react';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import { Timeline } from '../../../timeline';
import './timelineoverlay.css';

export const TimelineOverlay = ({ scatterState, setScatterState }) => {
    const [currentTime, setCurrentTime] = React.useState(null);
    React.useEffect(() => {
        const selectedTrackPoint = scatterState.selectedTrackPoint;
        if (!selectedTrackPoint || !selectedTrackPoint.track || !selectedTrackPoint.track.path) {
            return;
        }
        setCurrentTime(selectedTrackPoint.track.path.times[selectedTrackPoint.index])
    }, [scatterState.selectedTrackPoint])

    const handleCurrentTimeChange = React.useCallback((newCurrentTime) => {

    });

    if (!scatterState.selectedTrackPoint || 
        !scatterState.selectedTrackPoint.track || 
        !scatterState.selectedTrackPoint.track.path) {
        return null;
    }

    return (
        <Box id='scatter-timeline-overlay'>
            <Box id='scatter-timeline-container'>
                <Timeline
                    track={scatterState.selectedTrackPoint.track}
                    currentTime={currentTime}
                    setCurrentTime={handleCurrentTimeChange}
                    start={scatterState.selectedTrackPoint.track.path.times[0]}
                    end={scatterState.selectedTrackPoint.track.path.times.slice(-1)[0]} />
            </Box>
        </Box>
    )
}
import React from 'react';
import { Box } from '@mui/material';
import { Timeline } from '../../../timeline';
import { TrackPoint } from '../trackpoint';
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

    const handleTimelineClick = React.useCallback((e, newCurrentTime) => {
        const track = scatterState.selectedTrackPoint.track;
        const path = track.path;
        if (!path) {
            return;
        }

        let closestIndex = 0;
        let minDifference = Number.MAX_VALUE;

        for (let i = 0; i < path.times.length; i++) {
            const difference = Math.abs(newCurrentTime.diff(path.times[i]));
            if (difference < minDifference) {
                minDifference = difference;
                closestIndex = i;
            }
        }

        setScatterState(state => {
            return {...state, selectedTrackPoint: new TrackPoint(track, closestIndex)}
        });
    }, [scatterState.selectedTrackPoint]);

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
                    setCurrentTime={setCurrentTime}
                    start={scatterState.selectedTrackPoint.track.path.times[0]}
                    end={scatterState.selectedTrackPoint.track.path.times.slice(-1)[0]}
                    handleTimelineClick={handleTimelineClick}/>
            </Box>
        </Box>
    )
}
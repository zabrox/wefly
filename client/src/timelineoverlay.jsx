import React from 'react';
import { Timeline } from './timeline';
import './timelineoverlay.css';

export const TimelineOverlay = ({ playbackState, setPlaybackState }) => {
    if (!playbackState.selectedTrack) return null;

    return (
        <div id='timeline-overlay'>
            <Timeline
                track={playbackState.selectedTrack}
                playbackState={playbackState}
                setPlaybackState={setPlaybackState}
                start={playbackState.selectedTrack.times[0]}
                end={playbackState.selectedTrack.times[playbackState.selectedTrack.times.length - 1]} />
        </div>
    )
}
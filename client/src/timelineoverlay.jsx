import React from 'react';
import dayjs from 'dayjs';
import * as Cesium from 'cesium';
import { Timeline } from './timeline';
import { Track } from './track';
import * as CesiumMap from './cesiummap';
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
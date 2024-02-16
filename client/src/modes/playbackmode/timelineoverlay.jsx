import React from 'react';
import dayjs from 'dayjs';
import * as Cesium from 'cesium';
import { Timeline } from './timeline';
import { OverallTimeline } from './overalltimeline';
import './timelineoverlay.css';

export const TimelineOverlay = ({ playbackState, setPlaybackState }) => {

    return (
        <div id='timeline-overlay'>
            {playbackState.selectedTrack &&
                <div id='timeline-container'>
                    <Timeline
                        track={playbackState.selectedTrack}
                        playbackState={playbackState}
                        setPlaybackState={setPlaybackState}
                        start={playbackState.selectedTrack.times[0]}
                        end={playbackState.selectedTrack.times[playbackState.selectedTrack.times.length - 1]} />
                </div>
            }
            <div>
                <OverallTimeline playbackState={playbackState} setPlaybackState={setPlaybackState} />
            </div>
        </div>
    )
}
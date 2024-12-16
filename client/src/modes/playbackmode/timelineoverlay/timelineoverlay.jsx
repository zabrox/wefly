import React from 'react';
import { Timeline } from '../../../timeline';
import { OverallTimeline } from '../overalltimeline';
import './timelineoverlay.css';

export const TimelineOverlay = ({ playbackState, setPlaybackState }) => {

    return (
        <div id='timeline-overlay'>
            {playbackState.selectedTrack &&
                <div id='timeline-container'>
                    <Timeline
                        track={playbackState.selectedTrack}
                        currentTime={playbackState.currentTime}
                        setCurrentTime={(newCurrentTime) => {
                            setPlaybackState({ ...playbackState, currentTime: newCurrentTime });
                        }}
                        start={playbackState.selectedTrack.path.times[0]}
                        end={playbackState.selectedTrack.path.times[playbackState.selectedTrack.path.times.length - 1]} />
                </div>
            }
            <div>
                <OverallTimeline playbackState={playbackState} setPlaybackState={setPlaybackState} />
            </div>
        </div>
    )
}
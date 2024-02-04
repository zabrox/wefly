import React from 'react';
import dayjs from 'dayjs';
import { ControlPanel } from "./controlpanel";
import { PlaybackControlPanel } from "./playbackcontrolpanel";
import { TimelineOverlay } from './timelineoverlay';
import { TimelineControl } from './timelinecontrol';
import { TrackPlaybackStatsOverlay } from './trackplaybackstatsoverlay';

export const PlaybackMode = ({ state, setState }) => {
    const [playbackState, setPlaybackState] = React.useState({
        currentTime: dayjs(),
        selectedTrack: undefined,
    });
    return (
        <div>
            <TimelineOverlay playbackState={playbackState} setPlaybackState={setPlaybackState} />
            <TrackPlaybackStatsOverlay playbackState={playbackState} />
            <ControlPanel state={state} setState={setState}>
                <PlaybackControlPanel
                    state={state}
                    setState={setState}
                    playbackState={playbackState}
                    setPlaybackState={setPlaybackState} />
            </ControlPanel>
            <TimelineControl playbackState={playbackState} setPlaybackState={setPlaybackState} />
        </div>
    );
}
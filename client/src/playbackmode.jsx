import React from 'react';
import dayjs from 'dayjs';
import { ControlPanel } from "./controlpanel";
import { PlaybackControlPanel } from "./playbackcontrolpanel";
import { TimelineOverlay } from './timelineoverlay';
import { TimelineControl } from './timelinecontrol';
import { TrackPlaybackStatsOverlay } from './trackplaybackstatsoverlay';

const calculateStartStopTime = (targetTracks) => {
    const sortedByStart = targetTracks.toSorted((a, b) => {
        const d1 = new Date(a.startTime());
        const d2 = new Date(b.startTime());
        return d1 - d2;
    });
    const reversedByEnd = targetTracks.toSorted((a, b) => {
        const d1 = new Date(a.endTime());
        const d2 = new Date(b.endTime());
        return d2 - d1;
    });
    const start = sortedByStart[0].times[0];
    const stop = reversedByEnd[0].times[reversedByEnd[0].times.length - 1];
    return [start, stop];
}


export const PlaybackMode = ({ state, setState }) => {
    const [playbackState, setPlaybackState] = React.useState({
        currentTime: dayjs(),
        selectedTrack: undefined,
        startTime: undefined,
        stopTime: undefined,
    });
    React.useEffect(() => {
        const [start, stop] = calculateStartStopTime(state.actionTargetTracks);
        setPlaybackState({ ...playbackState, startTime: start, stopTime: stop });
    }, []);
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
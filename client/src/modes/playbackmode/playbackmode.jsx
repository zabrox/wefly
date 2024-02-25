import React from 'react';
import dayjs from 'dayjs';
import { ControlPanel } from "../../controlpanel";
import { PlaybackControlPanel } from "./playbackcontrolpanel";
import { TimelineOverlay } from './timelineoverlay';
import { TimelineControl } from './timelinecontrol';
import { TrackPlaybackStatsOverlay } from './trackplaybackstatsoverlay';
import { PLAYBACK_MODE } from '../mode';

const calculateStartStopTime = (targetTracks) => {
    if (targetTracks.length == 0 || targetTracks.findIndex((track) => track.path === undefined) !== -1) {
        return [undefined, undefined];
    }
    const sortedByStart = targetTracks.toSorted((a, b) => {
        return a.metadata.startTime.unix() - b.metadata.startTime.unix();
    });
    const reversedByEnd = targetTracks.toSorted((a, b) => {
        return b.metadata.lastTime.unix() - a.metadata.lastTime.unix();
    });
    const start = sortedByStart[0].path.times[0];
    const stop = reversedByEnd[0].path.times[reversedByEnd[0].path.times.length - 1];
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
        if (start === undefined || stop === undefined) {
            return;
        }
        setPlaybackState({ ...playbackState, startTime: start, stopTime: stop });
    }, [state.actionTargetTracks, playbackState.actionTargetTracks]);

    if (state.mode !== PLAYBACK_MODE) {
        return null;
    }

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
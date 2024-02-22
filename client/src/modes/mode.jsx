import React from 'react';
import { ScatterMode } from "./scattermode/scattermode";
import { PlaybackMode } from "./playbackmode/playbackmode";
import { TrackGroupSelector } from './scattermode/trackGroupSelector';
import { judgeMedia } from '../util/media';

export const SCATTER_MODE = 0;
export const PLAYBACK_MODE = 1;

export const Mode = () => {
    const defaultControlPanelSize = judgeMedia().isPc ?
        document.documentElement.clientWidth * 0.4 : document.documentElement.clientWidth;

    const [state, setState] = React.useState({
        tracks: [],
        trackGroups: [],
        controlPanelSize: defaultControlPanelSize,
        isControlPanelOpen: true,
        mode: SCATTER_MODE,
        actionTargetTracks: [],
    });
    const [scatterState, setScatterState] = React.useState({
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        loading: true,
        selectedTracks: new Set(),
        selectedTrackGroups: new TrackGroupSelector(),
    });

    if (state.mode === SCATTER_MODE) 
        return <ScatterMode state={state} setState={setState} scatterState={scatterState} setScatterState={setScatterState} />
    else if (state.mode === PLAYBACK_MODE)
        return <PlaybackMode state={state} setState={setState} />;
}
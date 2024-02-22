import React from 'react';
import { ScatterMode } from "./scattermode/scattermode";
import { PlaybackMode } from "./playbackmode/playbackmode";
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
    return (
        <div>
            <ScatterMode state={state} setState={setState} />
            <PlaybackMode state={state} setState={setState} />;
        </div>
    )
}
import React from 'react';
import { ScatterMode } from "./scattermode/scattermode";
import { PlaybackMode } from "./playbackmode/playbackmode";

export const SCATTER_MODE = 0;
export const PLAYBACK_MODE = 1;

export const Mode = ({state, setState}) => {
    return (
        <div>
            <ScatterMode state={state} setState={setState} />
            <PlaybackMode state={state} setState={setState} />;
        </div>
    )
}
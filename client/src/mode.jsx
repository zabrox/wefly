import React from 'react';
import dayjs from 'dayjs';
import { Filter } from './trackfilter';
import { ScatterMode } from "./scattermode";
import { PlaybackMode } from "./playbackmode";

export const SCATTER_MODE = 0;
export const PLAYBACK_MODE = 1;

export const Mode = ({ state, setState }) => {
    const [scatterState, setScatterState] = React.useState({
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        filter: new Filter(),
        loading: true,
    });

    if (state.mode === SCATTER_MODE) 
        return <ScatterMode
            state={state}
            setState={setState}
            scatterState={scatterState}
            setScatterState={setScatterState} />;
    else if (state.mode === PLAYBACK_MODE)
        return <PlaybackMode state={state} setState={setState} />;
}
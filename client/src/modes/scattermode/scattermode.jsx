import React from 'react';
import dayjs from 'dayjs';
import { Filter } from './trackfilter';
import { ControlPanel } from "../../controlpanel";
import { ScatterControlPanel } from "./scattercontrolpanel";
import { TrackGroupSelector } from './trackGroupSelector';

export const ScatterMode = ({ state, setState }) => {
    const [scatterState, setScatterState] = React.useState({
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        loading: true,
        selectedTracks: new Set(),
        selectedTrackGroups: new TrackGroupSelector(),
    });

    return (
        <ControlPanel state={state} setState={setState}>
            <ScatterControlPanel state={state} setState={setState} scatterState={scatterState} setScatterState={setScatterState} />
        </ControlPanel>
    );
}
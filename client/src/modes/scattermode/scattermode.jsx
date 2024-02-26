import React from 'react';
import dayjs from 'dayjs';
import { ControlPanel } from "../../controlpanel";
import { ScatterControlPanel } from "./scattercontrolpanel";
import { TrackGroupSelector } from './trackGroupSelector';
import { TracksLoadingDialog } from './tracksloadingdialog';
import { SCATTER_MODE } from '../mode';

export const ScatterMode = ({ state, setState }) => {
    const [scatterState, setScatterState] = React.useState({
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        loading: true,
        selectedTracks: new Set(),
        selectedTrackGroups: new TrackGroupSelector(),
    });

    if (state.mode !== SCATTER_MODE) {
        return null;
    }

    return (
        <div>
            <ControlPanel state={state} setState={setState}>
                <ScatterControlPanel state={state} setState={setState} scatterState={scatterState} setScatterState={setScatterState} />
            </ControlPanel>
            <TracksLoadingDialog open={scatterState.loading} />
        </div>
    );
}
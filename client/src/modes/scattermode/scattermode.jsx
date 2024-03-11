import React from 'react';
import dayjs from 'dayjs';
import { ControlPanel } from "../../controlpanel";
import { ScatterControlPanel } from "./scattercontrolpanel";
import { TrackGroupSelection } from './trackGroupSelection';
import { TracksLoadingDialog } from './tracksloadingdialog';
import { TrackPointStatsOverlay } from './trackpointstatsoverlay';
import { TrackPoint } from './trackpoint';
import { SCATTER_MODE } from '../mode';

export const ScatterMode = ({ state, setState }) => {
    const [scatterState, setScatterState] = React.useState({
        date: dayjs(),
        order: 'asc',
        orderBy: 'starttime',
        loading: true,
        selectedTracks: new Set(),
        selectedTrackGroups: new TrackGroupSelection(),
        selectedTrackPoint: new TrackPoint(),
    });

    if (state.mode !== SCATTER_MODE) {
        return null;
    }

    return (
        <div>
            <TrackPointStatsOverlay scatterState={scatterState} setScatterState={setScatterState} />
            <ControlPanel state={state} setState={setState}>
                <ScatterControlPanel state={state} setState={setState} scatterState={scatterState} setScatterState={setScatterState} />
            </ControlPanel>
            <TracksLoadingDialog open={scatterState.loading} />
        </div>
    );
}
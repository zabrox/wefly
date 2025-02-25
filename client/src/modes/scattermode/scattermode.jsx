import React from 'react';
import { ControlPanel } from "../../controlpanel";
import { ScatterControlPanel } from "./controlpanel/scattercontrolpanel";
import { TimelineOverlay } from './timelineoverlay/timelineoverlay';
import { TrackGroupSelection } from './trackGroupSelection';
import { TracksLoadingDialog } from './tracksloadingdialog';
import { TrackPointStatsOverlay } from './statsoverlay/trackpointstatsoverlay';
import { TakeoffLandingOverlay } from './takeofflandingoverlay/takeofflandingoverlay';
import { TrackPoint } from './trackpoint';
import { SCATTER_MODE } from '../mode';
import { ScatterMapMenu } from './scattermapmenu/scattermapmenu';

export const ScatterMode = ({ state, setState }) => {
    const [scatterState, setScatterState] = React.useState({
        order: 'asc',
        orderBy: 'starttime',
        loading: true,
        selectedTracks: new Set(),
        selectedTrackGroups: new TrackGroupSelection(),
        selectedTrackPoint: new TrackPoint(),
        tracksInPerspective: [],
        trackGroupsInPerspective: [],
        isTrackPointVisible: true,
        takeoffs: [],
        landings: [],
        organizations: [],
        selectedTakeoffLanding: undefined,
    });

    if (state.mode !== SCATTER_MODE) {
        return null;
    }

    return (
        <div>
            <TimelineOverlay scatterState={scatterState} setScatterState={setScatterState} />
            <ScatterMapMenu scatterState={scatterState} setScatterState={setScatterState} />
            <TrackPointStatsOverlay scatterState={scatterState} setScatterState={setScatterState} />
            <TakeoffLandingOverlay scatterState={scatterState} />
            <ControlPanel state={state} setState={setState}>
                <ScatterControlPanel state={state} setState={setState} scatterState={scatterState} setScatterState={setScatterState} />
            </ControlPanel>
            <TracksLoadingDialog open={scatterState.loading} />
        </div>
    );
}
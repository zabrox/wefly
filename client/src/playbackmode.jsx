import React from 'react';
import { ControlPanel } from "./controlpanel";
import { PlaybackControlPanel } from "./playbackcontrolpanel";

export const PlaybackMode = ({ state, setState }) => {
    return (
        <ControlPanel state={state} setState={setState}>
            <PlaybackControlPanel state={state} setState={setState} />
        </ControlPanel>
    );
}
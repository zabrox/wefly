import React from 'react';
import { ControlPanel } from "./controlpanel";
import { ScatterControlPanel } from "./scattercontrolpanel";

export const ScatterMode = ({ state, setState }) => {
    return (
        <ControlPanel state={state} setState={setState}>
            <ScatterControlPanel state={state} setState={setState} />
        </ControlPanel>
    );
}
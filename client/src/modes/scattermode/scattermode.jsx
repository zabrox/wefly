import React from 'react';
import dayjs from 'dayjs';
import { Filter } from './trackfilter';
import { ControlPanel } from "../../controlpanel";
import { ScatterControlPanel } from "./scattercontrolpanel";

export const ScatterMode = ({ state, setState, scatterState, setScatterState }) => {
    return (
        <ControlPanel state={state} setState={setState}>
            <ScatterControlPanel state={state} setState={setState} scatterState={scatterState} setScatterState={setScatterState} />
        </ControlPanel>
    );
}
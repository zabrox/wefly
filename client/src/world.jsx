import React from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as CesiumMap from "./cesiummap";
import { MessageDialog } from "./messagedialog";
import { SCATTER_MODE, Mode } from './mode';
import { judgeMedia } from './media';
import { ScatterMode } from "./scattermode";
import "./world.css";

const World = () => {
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div id='main'>
                <CesiumMap.CesiumMapContainer />
                <Mode state={state} setState={setState} />
                <MessageDialog />
            </div>
        </LocalizationProvider >
    );
};

export default World;
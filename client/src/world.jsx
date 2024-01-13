import React from "react";
import { ControlPanel } from "./controlpanel";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as CesiumMap from "./cesiummap";
import { Dragger } from "./dragger";
import { ControlPanelToggle } from "./controlpaneltoggle";
import { MessageDialog } from "./messagedialog";
import { SCATTER_MODE } from './mode';
import "./world.css";

let state = undefined;
let setState = undefined;
let media = undefined;

const judgeMedia = () => {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth <= 752) {
        return { isMobile: true, isTablet: false, isPc: false };
    } else if (clientWidth <= 1122) {
        return { isMobile: false, isTablet: true, isPc: false };
    }
    return { isMobile: false, isTablet: false, isPc: true };
}

const World = () => {
    media = judgeMedia();
    const defaultControlPanelSize = media.isPc ?
        document.documentElement.clientWidth * 0.4 : document.documentElement.clientWidth * 0.85;

    [state, setState] = React.useState({
        tracks: [],
        trackGroups: [],
        controlPanelSize: defaultControlPanelSize,
        mode: SCATTER_MODE,
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div id='main'>
                <CesiumMap.CesiumMapContainer />
                <ControlPanel state={state} setState={setState} />
                <Dragger
                    controlPanelSize={state.controlPanelSize}
                    setControlPanelSize={(width) => setState({ ...state, controlPanelSize: width })} />
                <ControlPanelToggle
                    controlPanelSize={state.controlPanelSize}
                    setControlPanelSize={(width) => setState({ ...state, controlPanelSize: width })} />
                <MessageDialog />
            </div>
        </LocalizationProvider >
    );
};

export default World;
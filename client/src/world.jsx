import React from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as CesiumMap from "./cesiummap";
import { Mode } from "./modes/mode";
import { MessageDialog } from "./messagedialog";
import { ErrorMessage } from "./errormessage";
import { ColorTheme } from "./colortheme";
import { judgeMedia } from './util/media';
import { SCATTER_MODE } from "./modes/mode";
import "./world.css";
import "./modes/scattermode/advancedsearch/locationpickdialog"

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
        errorMessage: '',
    });
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ColorTheme>
                <div id='main'>
                    <CesiumMap.CesiumMapContainer />
                    <Mode state={state} setState={setState} />
                    <MessageDialog />
                    <ErrorMessage state={state} setState={setState} />
                </div>
            </ColorTheme>
        </LocalizationProvider >
    );
};

export default World;
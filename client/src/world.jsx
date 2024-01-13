import React from "react";
import { ControlPanel } from "./controlpanel";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as CesiumMap from "./cesiummap";
import { MessageDialog } from "./messagedialog";
import "./world.css";

const World = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div id='main'>
                <CesiumMap.CesiumMapContainer />
                <ControlPanel />
                <MessageDialog />
            </div>
        </LocalizationProvider >
    );
};

export default World;
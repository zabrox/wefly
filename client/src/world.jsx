import React from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as CesiumMap from "./cesiummap";
import { Mode } from "./modes/mode";
import { MessageDialog } from "./messagedialog";
import { ColorTheme } from "./colortheme";
import "./world.css";
import "./modes/scattermode/advancedsearch/locationpickdialog"

const World = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ColorTheme>
                <div id='main'>
                    <CesiumMap.CesiumMapContainer />
                    <Mode />
                    <MessageDialog />
                </div>
            </ColorTheme>
        </LocalizationProvider >
    );
};

export default World;
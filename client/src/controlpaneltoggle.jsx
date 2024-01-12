import React from "react";
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRight';
import './controlpaneltoggle.css';

export const ControlPanelToggle = ({ controlPanelSize, setControlPanelSize }) => {
    const [prevControlPanelSize, setPrevControlPanelSize] = React.useState(controlPanelSize);

    return (
        <div id='control-panel-toggle'>
            {controlPanelSize === 0 ?
                <ArrowCircleRight
                    id='control-panel-toggle-button'
                    onClick={() => setControlPanelSize(prevControlPanelSize)} /> :
                <ArrowCircleLeft
                    id='control-panel-toggle-button'
                    onClick={() => {
                        setPrevControlPanelSize(controlPanelSize);
                        setControlPanelSize(0);
                    }} />}
        </div>
    )
}
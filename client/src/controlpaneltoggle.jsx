import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRight';
import './controlpaneltoggle.css';

export const ControlPanelToggle = ({ state, setState }) => {
    return (
        <div id='control-panel-toggle'>
            {state.controlPanelSize === 0 ?
                <ArrowCircleRight
                    id='control-panel-toggle-button'
                    onClick={() => setState({...state, controlPanelSize: state.prevControlPanelSize})} /> :
                <ArrowCircleLeft
                    id='control-panel-toggle-button'
                    onClick={() => {
                        setState({...state, controlPanelSize: 0, prevControlPanelSize: state.controlPanelSize});
                    }} />}
        </div>
    )
}
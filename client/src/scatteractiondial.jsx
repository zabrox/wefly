import { SpeedDial, SpeedDialAction } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { leaveScatterMode } from './scattermap';
import * as CesiumMap from './cesiummap';
import * as Mode from './mode';

export const ScatterActionDial = ({ state, setState, filter }) => {
    return (
        <SpeedDial id='scatter-modeaction-dial' ariaLabel='Scatter Mode Action Dial' size="medium" icon={<PlayArrowIcon />}
            sx={{
                position: 'absolute',
                bottom: '50px',
                left: state.controlPanelSize - 85,
            }}
            FabProps={{ sx: { bgcolor: '#e95800', '&:hover': { bgcolor: '#e95800', } } }}>
            <SpeedDialAction
                key='選択中のトラックを再生'
                icon={<PlayArrowIcon />}
                tooltipTitle='選択中のトラックを再生'
                tooltipOpen
                onClick={() => {
                    leaveScatterMode();
                    setState({ ...state, mode: Mode.PLAYBACK_MODE });
                }}
            />,
            <SpeedDialAction
                key='リスト再生'
                icon={<PlaylistPlayIcon />}
                tooltipTitle='リスト再生'
                tooltipOpen
                onClick={() => {
                    leaveScatterMode();
                    setState({ ...state, mode: Mode.PLAYBACK_MODE });
                }}
            />
        </SpeedDial>
    );
}
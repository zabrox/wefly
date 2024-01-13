import { SpeedDial } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import { stopPlayback } from './playbackmap';
import * as Mode from './mode';

export const PlaybackActionDial = ({ controlPanelSize, setMode }) => {
    return (
        <SpeedDial id='playback-mode-action-dial' ariaLabel='Playback Mode Action Dial' size="medium" icon={<StopIcon />}
            sx={{
                position: 'absolute',
                bottom: '50px',
                left: controlPanelSize - 85,
            }}
            FabProps={{ sx: { bgcolor: '#e95800', '&:hover': { bgcolor: '#e95800', } } }}
            onClick={() => {
                stopPlayback();
                setMode(Mode.SCATTER_MODE);
            }}>
        </SpeedDial>
    );
}
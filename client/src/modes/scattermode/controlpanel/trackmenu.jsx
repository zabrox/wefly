import React from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { zoomToTrackGroups } from '../../../cesiummap';
import { TrackPoint } from '../trackpoint';
import './trackmenu.css';

export const TrackMenu = ({ state, scatterState, setScatterState }) => {
    const [anchorElement, setAnchorElement] = React.useState(null);

    const showMenu = () => (anchorElement != null);

    const handleTrackMenuClick = (event) => {
        setAnchorElement(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorElement(null);
    }

    const handleBirdsEyeViewMenuClick = () => {
        if (state.trackGroups.length != 0) {
            zoomToTrackGroups(state.trackGroups);
        }
        handleClose();
    }

    const handleDeselectAllMenuClick = () => {
        setScatterState({
            ...scatterState,
            selectedTracks: new Set(),
            selectedTrackPoint: new TrackPoint(),
         });
        handleClose();
    }

    return (
        <Box>
            <IconButton id='track-menu'
                sx={{ padding: "0px 10px" }}
                onClick={handleTrackMenuClick}>
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="track-menu"
                open={showMenu()}
                anchorEl={anchorElement}
                onClose={handleClose}
            >
                <MenuItem key="menu1" onClick={handleBirdsEyeViewMenuClick}>
                    全トラックを俯瞰
                </MenuItem>
                <MenuItem key="menu2" onClick={handleDeselectAllMenuClick}>
                    全選択解除
                </MenuItem>
            </Menu>
        </Box>
    );
}
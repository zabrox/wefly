import React from 'react';
import { MenuItem, ListItemText } from '@mui/material';
import { zoomToTrackGroups } from '../../../cesiummap';

export const BirdsEyeViewMenuItem = ({ state, onClose }) => {
    const handleBirdsEyeViewMenuClick = React.useCallback(() => {
        if (state.trackGroups && state.trackGroups.length !== 0) {
            zoomToTrackGroups(state.trackGroups);
        }
        onClose && onClose();
    }, [state, onClose]);

    return (
        <MenuItem onClick={handleBirdsEyeViewMenuClick}>
            <ListItemText primary="全トラックを俯瞰" />
        </MenuItem>
    );
}


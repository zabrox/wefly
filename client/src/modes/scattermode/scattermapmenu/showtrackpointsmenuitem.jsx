import React from 'react';
import { MenuItem, Switch, ListItemText, ListItemSecondaryAction } from '@mui/material';

export const ShowTrackPointsMenuItem = ({ scatterState, setScatterState }) => {
    const handleSwitchToggle = () => {
        setScatterState({
            ...scatterState,
            isTrackPointVisible: !scatterState.isTrackPointVisible,
        });
    };

    return (
        <MenuItem>
            <ListItemText primary="点群の表示" />
            <ListItemSecondaryAction>
                <Switch
                    edge="end"
                    onChange={handleSwitchToggle}
                    checked={scatterState.isTrackPointVisible}
                />
            </ListItemSecondaryAction>
        </MenuItem>
    );
};

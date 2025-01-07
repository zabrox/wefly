import React from 'react';
import { MenuItem, Switch, ListItemText, ListItemSecondaryAction } from '@mui/material';

export const FullScreenMenuItem = () => {
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    const handleFullScreenToggle = React.useCallback(() => {
        if (!isFullScreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullScreen(state => !state);
    }, [isFullScreen]);

    return (
        <MenuItem>
            <ListItemText primary="全画面表示" />
            <ListItemSecondaryAction>
                <Switch
                    edge="end"
                    onChange={handleFullScreenToggle}
                    checked={isFullScreen}
                />
            </ListItemSecondaryAction>
        </MenuItem>
    );
};

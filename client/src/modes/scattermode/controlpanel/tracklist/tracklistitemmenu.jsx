import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const TrackListItemMenu = ({ track }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
    };

    const handleOpenSource = (event) => {
        window.open(track.metadata.dataSource, '_blank');
        handleClose(event);
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleOpenSource}>元サイトを開く</MenuItem>
                <MenuItem onClick={handleClose}>閉じる</MenuItem>
            </Menu>
        </div>
    );
};

export default TrackListItemMenu;

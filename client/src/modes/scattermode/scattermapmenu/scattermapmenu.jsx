import React from 'react';
import { Box, IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './scattermapmenu.css';
import { ShowTrackPointsMenuItem } from './showtrackpointsmenuitem';

export const ScatterMapMenu = ({ scatterState, setScatterState }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box className='scattermapmenu-wrapper' style={{ position: 'fixed', bottom: 100, right: 20 }}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
                className="scattermapmenu"
            >
                <MoreVertIcon style={{ width: 20, height: 20 }} />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        },
                    }
                }}
            >
                <ShowTrackPointsMenuItem scatterState={scatterState} setScatterState={setScatterState} handleClose={handleClose} />
            </Menu>
        </Box>
    );
};

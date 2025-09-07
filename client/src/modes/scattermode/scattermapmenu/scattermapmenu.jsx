import React from 'react';
import { Box, IconButton, Menu, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './scattermapmenu.css';
import { ShowTrackPointsMenuItem } from './showtrackpointsmenuitem';
import { FullScreenMenuItem } from './fullscreenmenuitem';
import { PlaybackMenuItem } from './playbackmenuitem';
import { BirdsEyeViewMenuItem } from './birdseyeviewmenuitem';

export const ScatterMapMenu = ({ state, setState, scatterState, setScatterState }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // menu item handlers are moved into dedicated components

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
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: 48 * 6,
                            width: 'auto',
                            minWidth: '28ch',
                            whiteSpace: 'nowrap',
                        },
                    }
                }}
            >
                <PlaybackMenuItem state={state} setState={setState} scatterState={scatterState} onClose={handleClose} />
                <Divider />
                <BirdsEyeViewMenuItem state={state} onClose={handleClose} />
                <ShowTrackPointsMenuItem scatterState={scatterState} setScatterState={setScatterState} />
                <FullScreenMenuItem />
            </Menu>
        </Box>
    );
};

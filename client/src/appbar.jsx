import React from 'react';
import { Box, AppBar, Typography, Toolbar, Drawer, IconButton } from '@mui/material';
import { List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuIcon from '@mui/icons-material/Menu';
import { AboutDialog } from './aboutdialog';
import './appbar.css';

export const WeflyAppBar = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [aboutDialogOpen, setAboutDialogOpen] = React.useState(false);

    const handleTitleClick = () => {
        window.location.href = '/';
    }
    const handleClickAbout = () => {
        setAboutDialogOpen(true);
    };

    return (
        <AppBar id='app-bar' position="static">
            <Toolbar>
                <IconButton onClick={() => setDrawerOpen(true)}>
                    <MenuIcon />
                </IconButton>
                <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <Box>
                        <List>
                            <ListItemButton onClick={handleClickAbout}>
                                <ListItemIcon>
                                    <HelpOutlineIcon />
                                </ListItemIcon>
                                <ListItemText primary="WeFlyについて" />
                            </ListItemButton>
                            <ListItemButton>
                                <a href='https://note.com/parazabro/n/n2fe683bd7b0c'
                                    target='_blank'
                                    rel='noreferrer noopener'
                                    style={{ textDecoration: 'none', display: 'flex' }}>
                                    <ListItemIcon>
                                        <LightbulbIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="使い方" />
                                </a>
                            </ListItemButton>
                        </List>
                        <AboutDialog open={aboutDialogOpen} setOpen={setAboutDialogOpen} />
                    </Box>
                </Drawer>
                <Typography id='title' variant="h5" onClick={handleTitleClick} color='primary.contrastText'>
                    WeFly
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
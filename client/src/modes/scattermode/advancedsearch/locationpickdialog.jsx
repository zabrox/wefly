import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle } from 'react-leaflet';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, Slider, Typography } from '@mui/material';
import { judgeMedia } from '../../../util/media';
import "leaflet/dist/leaflet.css";
import "./locationpickdialog.css";

export function LocationPickDialog({ searchCondition, open, onClose, onConfirm }) {
    const [bounds, setBounds] = useState(searchCondition.bounds);
    const [boundsSize, setBoundsSize] = useState(
        searchCondition.bounds ? searchCondition.bounds[1][0] - searchCondition.bounds[0][0] : 0.5);
    const minBoundsSize = 0.02;
    const maxBoundsSize = 1.0;

    const center = bounds ? [(bounds[0][1] + bounds[1][1]) / 2, (bounds[0][0] + bounds[1][0]) / 2] : [35.681236, 139.767125];

    const MapWithSelection = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setBounds([
                    [lng - boundsSize / 2, lat - boundsSize / 2],
                    [lng + boundsSize / 2, lat + boundsSize / 2]]);
            },
        }, [boundsSize]);

        return bounds ? <Rectangle bounds={[[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]]} editable={true} /> : null;
    };

    const handleSliderChange = React.useCallback((e, newValue) => {
        setBoundsSize(newValue);
        if (bounds) {
            const center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
            setBounds([
                [center[0] - newValue / 2, center[1] - newValue / 2],
                [center[0] + newValue / 2, center[1] + newValue / 2]
            ]);
        }
    }, [bounds]);

    const handleConfirm = () => {
        onConfirm(bounds);
        onClose();
    };

    const mapWidth = document.documentElement.clientWidth * (judgeMedia().isMobile ? 0.8 : 0.3);
    const mapHeight = document.documentElement.clientHeight * (judgeMedia().isMobile ? 0.7 : 0.5);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>スタート位置を選択</DialogTitle>
            <DialogContent>
                <MapContainer style={{ height: mapHeight, width: mapWidth }} center={center} zoom={7}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapWithSelection />
                </MapContainer>
                <Box display='flex' style={{padding: '5px'}}>
                    <Typography id='bounds-size-label' variant='caption'>領域サイズ</Typography>
                    <Slider id='bounds-size-slider'
                        size='small'
                        value={boundsSize}
                        onChange={handleSliderChange}
                        min={minBoundsSize}
                        max={maxBoundsSize}
                        step={0.01} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleConfirm}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
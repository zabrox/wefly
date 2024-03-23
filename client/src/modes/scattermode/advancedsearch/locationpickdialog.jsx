import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle } from 'react-leaflet';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { judgeMedia } from '../../../util/media';
import "leaflet/dist/leaflet.css";
import "./locationpickdialog.css";

export function LocationPickDialog({ open, onClose, onConfirm }) {
    const [bounds, setBounds] = useState(null);

    const MapWithSelection = () => {
        useMapEvents({
            click(e) {
                const rectSize = 0.1;
                const { lat, lng } = e.latlng;
                setBounds([
                    [lat - rectSize / 2, lng - rectSize / 2],
                    [lat + rectSize / 2, lng + rectSize / 2]]);
            },
        });

        return bounds ? <Rectangle bounds={bounds} editable={true} /> : null;
    };

    const handleConfirm = () => {
        onConfirm(bounds);
        onClose();
    };

    const mapWidth = document.documentElement.clientWidth * (judgeMedia().isMobile ? 0.8 : 0.3);
    const mapHeight = document.documentElement.clientHeight * (judgeMedia().isMobile ? 0.7 : 0.5);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>ロケーションを追加</DialogTitle>
            <DialogContent>
                <MapContainer style={{ height: mapHeight, width: mapWidth }} center={[35.681236, 139.767125]} zoom={5}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapWithSelection />
                </MapContainer>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleConfirm}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
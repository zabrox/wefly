import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const compareByKey = (key, track1, track2) => {
    const value1 = typeof track1.metadata[key] === 'function' ? track1.metadata[key]() : track1.metadata[key];
    const value2 = typeof track2.metadata[key] === 'function' ? track2.metadata[key]() : track2.metadata[key];
    if (typeof value1 === 'string') {
        return value1.localeCompare(value2);
    }
    return value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
}

export const headers = [
    {
        id: 'activity',
        name: 'アクティビティ',
        comparator: compareByKey.bind(null, 'activity'),
    },
    {
        id: 'pilotname',
        name: 'パイロット',
        comparator: compareByKey.bind(null, 'pilotname'),
    },
    {
        id: 'area',
        name: 'エリア',
        comparator: ((track1, track2) => {
            const area1 = track1.metadata.area;
            const area2 = track2.metadata.area;
            return area1.localeCompare(area2);
        }),
    },
    {
        id: 'starttime',
        name: '開始時刻',
        comparator: compareByKey.bind(null, 'startTime'),
    },
    {
        id: 'duration',
        name: '飛行時間',
        comparator: compareByKey.bind(null, 'duration'),
    },
    {
        id: 'maxalt',
        name: '最高高度',
        comparator: compareByKey.bind(null, 'maxAltitude'),
    },
    {
        id: 'distance',
        name: '距離',
        comparator: compareByKey.bind(null, 'distance'),
    },
];

const TrackListSortDialog = ({ open, onClose, scatterState, setScatterState }) => {
    const [orderBy, setOrderBy] = React.useState(scatterState.orderBy);
    const [order, setOrder] = React.useState(scatterState.order);

    const handleOrderByChange = (event) => {
        setOrderBy(event.target.value);
    };

    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };

    const handleApply = () => {
        setScatterState({ ...scatterState, orderBy, order });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>トラックの並べ替え</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="order-by-label">並べ替え</InputLabel>
                    <Select
                        labelId="order-by-label"
                        value={orderBy}
                        onChange={handleOrderByChange}
                    >
                        {headers.map((header) => (
                            <MenuItem key={header.id} value={header.id}>
                                {header.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="order-label">順番</InputLabel>
                    <Select
                        labelId="order-label"
                        value={order}
                        onChange={handleOrderChange}
                    >
                        <MenuItem value="asc">昇順</MenuItem>
                        <MenuItem value="desc">降順</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleApply} color="primary">Apply</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TrackListSortDialog;

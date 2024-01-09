import { useState } from 'react';
import { IconButton, Button, Dialog, DialogTitle, List, ListItem, Checkbox, ListItemText } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './trackfilter.css';

export const TrackFilter = ({ filterContents, trackFilter, onTrackFilterChange }) => {
    const [showTrackFilter, setShowTrackFilter] = useState(false);

    const handleToggle = (value) => () => {
        const currentIndex = trackFilter.indexOf(value);
        const newTrackFilter = [...trackFilter];

        if (currentIndex === -1) {
            newTrackFilter.push(value);
        } else {
            newTrackFilter.splice(currentIndex, 1);
        }

        onTrackFilterChange(newTrackFilter);
    };

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <IconButton id='trackfilter-icon' onClick={(event) => {
                setShowTrackFilter(!showTrackFilter)
                event.stopPropagation();
            }}>
                <FilterListIcon
                    style={{ color: trackFilter.length != 0 && trackFilter.length != filterContents.length ? 'e95800' : '' }} />
            </IconButton>
            <Dialog id='trackfilter-dialog' open={showTrackFilter} onClose={() => setShowTrackFilter(false)}>
                <DialogTitle>Filter tracks</DialogTitle>
                <List id='trackfilter-list'>
                    {filterContents.map((content) => (
                        <ListItem key={content} onClick={handleToggle(content)}>
                            <Checkbox checked={trackFilter.includes(content)} />
                            <ListItemText primary={content} />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={() => setShowTrackFilter(false)}>Close</Button>
            </Dialog>
        </div>
    );
};

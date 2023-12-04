import { useState } from 'react';
import { IconButton, Button, Dialog, DialogTitle, List, ListItem, Checkbox, ListItemText } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './areaselector.css';

export const AreaSelector = ({ areas, areasFilter, onAreasFilterChange }) => {
    const [showAreaSelector, setShowAreaSelector] = useState(false);

    const handleToggle = (value) => () => {
        const currentIndex = areasFilter.indexOf(value);
        const newAreasFilter = [...areasFilter];

        if (currentIndex === -1) {
            newAreasFilter.push(value);
        } else {
            newAreasFilter.splice(currentIndex, 1);
        }

        onAreasFilterChange(newAreasFilter);
    };

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <IconButton id='areafilter' onClick={(event) => {
                setShowAreaSelector(!showAreaSelector)
                event.stopPropagation();
            }}>
                <FilterListIcon
                    style={{ color: areasFilter.length != 0 && areasFilter.length != areas.length ? '0099FF' : '' }} />
            </IconButton>
            <Dialog id='areaselector' open={showAreaSelector} onClose={() => setShowAreaSelector(false)}>
                <DialogTitle>Select area...</DialogTitle>
                <List id='arealist'>
                    {areas.map((area) => (
                        <ListItem key={area} onClick={handleToggle(area)}>
                            <Checkbox checked={areasFilter.includes(area)} />
                            <ListItemText primary={area} />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={() => setShowAreaSelector(false)}>Close</Button>
            </Dialog>
        </div>
    );
};

import { useState } from 'react';
import { IconButton, Button, Dialog, DialogTitle, List, ListItem, Checkbox, ListItemText } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './trackfilter.css';
import { Track } from './track';

export class Filter {
    PILOTNAME_KEY = 'pilotname';
    ACTIVITY_KEY = 'activity';
    AREA_KEY = 'area';

    contents = {};
    filters = {};

    constructor(instance) {
        if (instance) {
            this.contents = { ...instance.contents };
            this.filters = { ...instance.filters };
        } else {
            this.contents[this.PILOTNAME_KEY] = new Array();
            this.contents[this.ACTIVITY_KEY] = new Array();
            this.contents[this.AREA_KEY] = new Array();
            this.filters[this.PILOTNAME_KEY] = new Array();
            this.filters[this.ACTIVITY_KEY] = new Array();
            this.filters[this.AREA_KEY] = new Array();
        }
    }

    setContents(pilotnames, activities, areas) {
        this.contents[this.PILOTNAME_KEY] = pilotnames;
        this.contents[this.ACTIVITY_KEY] = activities;
        this.contents[this.AREA_KEY] = areas;
    }

    clear() {
        this.filters[this.PILOTNAME_KEY] = new Array();
        this.filters[this.ACTIVITY_KEY] = new Array();
        this.filters[this.AREA_KEY] = new Array();
    }

    filterTracks(tracks) {
        return tracks.filter((track) => {
            return (this.filters[this.PILOTNAME_KEY].length == 0 || this.filters[this.PILOTNAME_KEY].includes(track.pilotname)) &&
                (this.filters[this.ACTIVITY_KEY].length == 0 || this.filters[this.ACTIVITY_KEY].includes(track.activity)) &&
                (this.filters[this.AREA_KEY].length == 0 || this.filters[this.AREA_KEY].includes(track.area));
        });
    }

    filtersTrack(track) {
        return !((this.filters[this.PILOTNAME_KEY].length == 0 || this.filters[this.PILOTNAME_KEY].includes(track.pilotname)) &&
            (this.filters[this.ACTIVITY_KEY].length == 0 || this.filters[this.ACTIVITY_KEY].includes(track.activity)) &&
            (this.filters[this.AREA_KEY].length == 0 || this.filters[this.AREA_KEY].includes(track.area)));
    }
}

const filterTrackEntities = (tracks, filter) => {
    const unfiltered = filter.filterTracks(tracks);
    const filtered = tracks.filter((track) => !unfiltered.includes(track));
    filtered.forEach((track) => track.filter(true));
    unfiltered.forEach((track) => track.filter(false));
}

export const TrackFilter = ({ tracks, filterkey, filter, setFilter }) => {
    const [showTrackFilter, setShowTrackFilter] = useState(false);

    const handleToggle = (value) => () => {
        const currentIndex = filter.filters[filterkey].indexOf(value);
        const newTrackFilter = new Filter(filter);
        newTrackFilter.filterTracks = filter.filterTracks;

        if (currentIndex === -1) {
            newTrackFilter.filters[filterkey] = [...filter.filters[filterkey], value];
        } else {
            newTrackFilter.filters[filterkey] = filter.filters[filterkey].filter((item) => item !== value);
        }

        setFilter(newTrackFilter);
        filterTrackEntities(tracks, newTrackFilter);
    };

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <IconButton id='trackfilter-icon' onClick={(event) => {
                setShowTrackFilter(!showTrackFilter)
                event.stopPropagation();
            }}>
                <FilterListIcon
                    style={{ color: filter.filters[filterkey].length != 0 && filter.filters[filterkey].length != filter.contents[filterkey].length ? 'e95800' : '' }} />
            </IconButton>
            <Dialog id='trackfilter-dialog' open={showTrackFilter} onClose={() => setShowTrackFilter(false)}>
                <DialogTitle>Filter tracks</DialogTitle>
                <List id='trackfilter-list'>
                    {filter.contents[filterkey].map((content) => (
                        <ListItem key={content} onClick={handleToggle(content)}>
                            <Checkbox checked={filter.filters[filterkey].includes(content)} />
                            <ListItemText primary={content} />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={() => setShowTrackFilter(false)}>Close</Button>
            </Dialog>
        </div>
    );
};

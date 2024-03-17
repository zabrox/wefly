import { useState } from 'react';
import { IconButton, Button, Dialog, DialogTitle, List, ListItem, Checkbox, ListItemText } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './trackfilter.css';

export class Filter {
    PILOTNAME_KEY = 'pilotname';
    ACTIVITY_KEY = 'activity';
    AREA_KEY = 'area';
    TRACK_GROUP_KEY = 'trackgroup';

    contents = {};
    filters = {};

    constructor(instance) {
        if (instance) {
            this.contents = { ...instance.contents };
            this.filters = { ...instance.filters };
        } else {
            this.contents[this.PILOTNAME_KEY] = new Set();
            this.contents[this.ACTIVITY_KEY] = new Set();
            this.contents[this.AREA_KEY] = new Set();
            this.contents[this.TRACK_GROUP_KEY] = new Set();
            this.filters[this.PILOTNAME_KEY] = new Set();
            this.filters[this.ACTIVITY_KEY] = new Set();
            this.filters[this.AREA_KEY] = new Set();
            this.filters[this.TRACK_GROUP_KEY] = new Set();
        }
    }

    setContents(pilotnames, activities, areas, trackgroups) {
        this.contents[this.PILOTNAME_KEY] = pilotnames;
        this.contents[this.ACTIVITY_KEY] = activities;
        this.contents[this.AREA_KEY] = areas;
        this.contents[this.TRACK_GROUP_KEY] = trackgroups;
    }

    clear() {
        this.filters[this.PILOTNAME_KEY] = new Set();
        this.filters[this.ACTIVITY_KEY] = new Set();
        this.filters[this.AREA_KEY] = new Set();
        this.filters[this.TRACK_GROUP_KEY] = new Set();
    }

    trackGroupFilter() {
        return this.filters[this.TRACK_GROUP_KEY];
    }
    #filteredByTrackGroup(track) {
        for (const trackgroup of this.trackGroupFilter()) {
            if (trackgroup.trackIds.includes(track.getId())) {
                return true;
            }
        }
        return false;
    }

    filterTracks(tracks) {
        return tracks.filter((track) => {
            return (this.filters[this.PILOTNAME_KEY].size == 0 || this.filters[this.PILOTNAME_KEY].has(track.metadata.pilotname)) &&
                (this.filters[this.ACTIVITY_KEY].size == 0 || this.filters[this.ACTIVITY_KEY].has(track.metadata.activity)) &&
                (this.filters[this.AREA_KEY].size == 0 || this.filters[this.AREA_KEY].has(track.metadata.area)) &&
                (this.filters[this.TRACK_GROUP_KEY].size == 0 || this.#filteredByTrackGroup(track));
        });
    }

    filtersTrack(track) {
        return !((this.filters[this.PILOTNAME_KEY].size == 0 || this.filters[this.PILOTNAME_KEY].has(track.metadata.pilotname)) &&
            (this.filters[this.ACTIVITY_KEY].size == 0 || this.filters[this.ACTIVITY_KEY].has(track.metadata.activity)) &&
            (this.filters[this.AREA_KEY].size == 0 || this.filters[this.AREA_KEY].has(track.metadata.area)) &&
            (this.filters[this.TRACK_GROUP_KEY].size == 0 || this.#filteredByTrackGroup(track)));
    }
}

export const TrackFilter = ({ filterkey, filter, setFilter }) => {
    const [showTrackFilter, setShowTrackFilter] = useState(false);

    const handleToggle = (value) => () => {
        const newTrackFilter = new Filter(filter);
        newTrackFilter.filterTracks = filter.filterTracks;

        if (!filter.filters[filterkey].has(value)) {
            newTrackFilter.filters[filterkey].add(value);
        } else {
            newTrackFilter.filters[filterkey].delete(value);
        }

        setFilter(newTrackFilter);
    };

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <IconButton id={`trackfilter-icon-${filterkey}`} onClick={(event) => {
                setShowTrackFilter(!showTrackFilter)
                event.stopPropagation();
            }}>
                <FilterListIcon
                    style={{ color: filter.filters[filterkey].size != 0 && filter.filters[filterkey].size != filter.contents[filterkey].size ? 'e95800' : '' }} />
            </IconButton>
            <Dialog id='trackfilter-dialog' open={showTrackFilter} onClose={() => setShowTrackFilter(false)}>
                <DialogTitle>Filter tracks</DialogTitle>
                <List id='trackfilter-list'>
                    {Array.from(filter.contents[filterkey]).map((content) => 
                        <ListItem key={content} onClick={handleToggle(content)}>
                            <Checkbox checked={filter.filters[filterkey].has(content)} />
                            <ListItemText primary={content} />
                        </ListItem>
                    )}
                </List>
                <Button onClick={() => setShowTrackFilter(false)}>Close</Button>
            </Dialog>
        </div>
    );
};

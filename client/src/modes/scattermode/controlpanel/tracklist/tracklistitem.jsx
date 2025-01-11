import React from 'react';
import { ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import AirplanemodeActiveOutlinedIcon from '@mui/icons-material/AirplanemodeActiveOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { ActivityIcon } from '../../../../util/activityicon';
import { trackColor } from '../../../../util/trackcolor';
import { PilotIcon } from '../../../../util/piloticon';
import './tracklistitem.css';

const PilotName = ({ track }) => {
    return (
        <Box className='pilotname'>
            <ActivityIcon track={track} size={28} />
            <Box sx={{ marginLeft: '10px', fontWeight: 500 }}>
                {track.metadata.pilotname}
            </Box>
        </Box>
    );
}
const StartTime = ({ track }) => {
    return (
        <Box className='trackstatsitem'>
            <QueryBuilderOutlinedIcon />
            {track.metadata.startTime.format('YYYY-MM-DD HH:mm')}
        </Box>
    );
}
const Duration = ({ track }) => {
    return (
        <Box className='trackstatsitem'>
            <TimerOutlinedIcon />
            {track.metadata.durationString()}
        </Box>
    );
}
const Area = ({ track }) => {
    const area = track.metadata;
    if (area === undefined || area.area === '') {
        return null;
    }
    return (
        <Box className='trackstatsitem'>
            <PlaceOutlinedIcon />
            {track.metadata.area}
        </Box>
    );
}
const Model = ({ track }) => {
    if (track.metadata.model === '') {
        return null;
    }
    return (
        <Box className='trackstatsitem'>
            <AirplanemodeActiveOutlinedIcon />
            {track.metadata.model}
        </Box>
    );
}
const MaxAltitude = ({ track }) => {
    return (
        <Box className='trackstatsitem maxaltitude'>
            <LandscapeOutlinedIcon />
            {`${track.metadata.maxAltitude}m`}
        </Box>
    );
}
const Distance = ({ track }) => {
    return (
        <Box className='trackstatsitem maxaltitude'>
            <MultipleStopIcon />
            {`${track.metadata.distance}km`}
        </Box>
    );
}

const TrackListItem = ({ track, selected, onClick }) => {
    return (
        <ListItem
            button
            onClick={onClick}
            style={{
                backgroundColor: selected ? trackColor(track).withAlpha(0.6).toCssHexString() : '',
            }}
            className='tracklistitem'
        >
            <ListItemIcon>
                <PilotIcon track={track} size={42} />
            </ListItemIcon>
            <Box>
                <PilotName track={track} />
                <Box className='trackstatscontainer'>
                    <Area track={track} />
                    <Model track={track} />
                </Box>
                <Box className='trackstatscontainer'>
                    <StartTime track={track} />
                    <Duration track={track} />
                </Box>
                <Box className='trackstatscontainer'>
                    <MaxAltitude track={track} />
                    <Distance track={track} />
                </Box>
            </Box>
        </ListItem>
    );
};

export default TrackListItem;
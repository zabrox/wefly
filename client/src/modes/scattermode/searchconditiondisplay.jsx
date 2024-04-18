import React from 'react';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { SearchCondition } from './searchcondition';
import { loadTracks } from './trackloader';
import { TrackGroupSelection } from './trackGroupSelection';
import { TrackPoint } from './trackpoint';
import { AdvancedSearchDialog } from './advancedsearch/advancedsearchdialog';
import { judgeMedia } from '../../util/media'
import * as CesiumMap from '../../cesiummap';
import './searchconditiondisplay.css';

const DatePicker = ({ searchCondition, handleDateChange }) => {
    console.log(searchCondition.from.format('YYYY-MM-DD (ddd)'));
    return (
        <DesktopDatePicker
            value={searchCondition.from}
            format="YYYY-MM-DD (ddd)"
            onChange={handleDateChange} />
    );
}

const AdvancedSearchCondition = ({ searchCondition }) => {
    const variant = judgeMedia().isMobile ? 'caption' : 'body2';
    return (
        <Box style={{ width: '80%' }}>
            <Grid container id='advanced-search-condition' spacing={1} columnSpacing={{ md: 2, sm: 1, xs: 1 }}>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>From:</b> {searchCondition.from.format('YYYY-MM-DD')}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>To:</b> {searchCondition.to.format('YYYY-MM-DD')}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>パイロット:</b> {searchCondition.pilotname === '' ? '---' : searchCondition.pilotname}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>最高高度:</b> {!searchCondition.maxAltitude ? '---' : searchCondition.maxAltitude}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>飛行距離:</b> {!searchCondition.distance ? '---' : searchCondition.distance}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>飛行時間:</b> {!searchCondition.duration ? '---' : searchCondition.duration}</Typography>
                </Grid>
            </Grid >
        </Box >
    );
}

const initializeSearchCondition = () => {
    const condition = new SearchCondition();
    if (window.location.search === '') {
        return condition;
    }
    const params = new URLSearchParams(window.location.search);
    condition.from = dayjs(params.get('from')).startOf('day');
    condition.to = dayjs(params.get('to')).endOf('day');
    condition.pilotname = params.get('pilotname');
    condition.maxAltitude = parseInt(params.get('maxAltitude'));
    condition.distance = parseFloat(params.get('distance'));
    condition.duration = parseFloat(params.get('duration'));
    condition.activities = params.get('activities').split(',');
    const boundsArray = params.get('bounds').split(',').map(parseFloat);
    condition.bounds = [[boundsArray[0], boundsArray[1]], [boundsArray[2], boundsArray[3]]];
    return condition;
}

const setUrl = (searchCondition) => {
    history.replaceState(null, '',
        `?from=${searchCondition.from.format('YYYY-MM-DD')}` +
        `&to=${searchCondition.to.format('YYYY-MM-DD')}` +
        `&pilotname=${searchCondition.pilotname}` +
        `&maxAltitude=${searchCondition.maxAltitude}` +
        `&distance=${searchCondition.distance}` +
        `&duration=${searchCondition.duration}` +
        `&activities=${searchCondition.activities.join(',')}` +
        `&bounds=${searchCondition.bounds}`);
}

export const SearchConditionDisplay = ({ state, setState, scatterState, setScatterState }) => {
    const [searchCondition, setSearchCondition] = React.useState(initializeSearchCondition());
    return <SearchConditionDisplayImpl
        searchCondition={searchCondition}
        setSearchCondition={setSearchCondition}
        state={state}
        setState={setState}
        scatterState={scatterState}
        setScatterState={setScatterState} />;
}
export const SearchConditionDisplayImpl = ({
    searchCondition, setSearchCondition, state, setState, scatterState, setScatterState }) => {

    const [showAdvancedSearchDialog, setShowAdvancedSearchDialog] = React.useState(false);

    React.useEffect(() => {
        if (state.tracks.length === 0) {
            handleSearchConditionChange(searchCondition, state, setState, scatterState, setScatterState);
        }
    }, []);

    const handleSearchConditionChange = React.useCallback((newSearchCondition) => {
        CesiumMap.removeAllEntities();
        setSearchCondition(newSearchCondition);
        loadTracks(newSearchCondition,
            state, setState, {
            ...scatterState,
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
        }, setScatterState);
        setUrl(newSearchCondition);
    }, [state, scatterState]);

    const handleDateChange = React.useCallback((newDate) => {
        const date = dayjs(newDate);
        const copySearchCondition = searchCondition;
        copySearchCondition.from = date.startOf('day');
        copySearchCondition.to = date.endOf('day');
        handleSearchConditionChange(copySearchCondition);
    }, [state, scatterState]);

    const handleAdvancedSearchIconClick = React.useCallback(() => {
        setShowAdvancedSearchDialog(true);
    });

    return (
        <div id='date-picker-container'>
            {searchCondition.isAdvancedSearchEnabled() ?
                <AdvancedSearchCondition searchCondition={searchCondition} /> :
                <DatePicker searchCondition={searchCondition} handleDateChange={handleDateChange} />}
            <AddCircleOutlineIcon
                id='advanced-search'
                color='primary'
                onClick={handleAdvancedSearchIconClick} />
            <AdvancedSearchDialog
                searchCondition={searchCondition}
                show={showAdvancedSearchDialog}
                setShow={setShowAdvancedSearchDialog}
                search={handleSearchConditionChange} />
        </div>
    );
}
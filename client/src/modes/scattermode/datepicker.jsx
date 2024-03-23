import React from 'react';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { loadTracks } from './trackloader';
import { TrackGroupSelection } from './trackGroupSelection';
import { TrackPoint } from './trackpoint';
import { AdvancedSearchDialog } from './advancedsearch/advancedsearchdialog';
import { judgeMedia } from '../../util/media'
import * as CesiumMap from '../../cesiummap';
import './datepicker.css';

const DatePicker = ({ scatterState, handleDateChange }) => {
    return (
        <DesktopDatePicker
            defaultValue={scatterState.searchCondition.from}
            format="YYYY-MM-DD (ddd)"
            onChange={handleDateChange} />
    );
}

const AdvancedSearchCondition = ({ scatterState }) => {
    const cond = scatterState.searchCondition;
    const variant = judgeMedia().isMobile ? 'caption' : 'body2';
    return (
        <Box style={{ width: '80%' }}>
            <Grid container id='advanced-search-condition' spacing={1} columnSpacing={{ md: 2, sm: 1, xs: 1 }}>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>From:</b> {cond.from.format('YYYY-MM-DD')}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>To:</b> {cond.to.format('YYYY-MM-DD')}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>パイロット:</b> {cond.pilotname === '' ? '---' : cond.pilotname}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>最高高度:</b> {!cond.maxAltitude ? '---' : cond.maxAltitude}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>飛行距離:</b> {!cond.distance ? '---' : cond.distance}</Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                    <Typography variant={variant}><b>飛行時間:</b> {!cond.duration ? '---' : cond.duration}</Typography>
                </Grid>
            </Grid >
        </Box >
    );
}

export const SearchCondition = ({ state, setState, scatterState, setScatterState }) => {
    const [showAdvancedSearchDialog, setShowAdvancedSearchDialog] = React.useState(false);

    React.useEffect(() => {
        if (state.tracks.length === 0) {
            loadTracks(state, setState, scatterState, setScatterState);
        }
    }, []);

    const handleSearchConditionChange = React.useCallback((newSearchCondition) => {
        CesiumMap.removeAllEntities();
        loadTracks(state, setState, {
            ...scatterState,
            selectedTracks: new Set(),
            selectedTrackGroups: new TrackGroupSelection(),
            selectedTrackPoint: new TrackPoint(),
            searchCondition: newSearchCondition,
        }, setScatterState);
    }, [state, scatterState]);

    const handleDateChange = React.useCallback((newDate) => {
        const date = dayjs(newDate);
        const copySearchCondition = scatterState.searchCondition;
        copySearchCondition.from = date.startOf('day');
        copySearchCondition.to = date.endOf('day');
        handleSearchConditionChange(copySearchCondition);
    }, [state, scatterState]);

    const handleAdvancedSearchIconClick = React.useCallback(() => {
        setShowAdvancedSearchDialog(true);
    });

    return (
        <div id='date-picker-container'>
            {scatterState.searchCondition.isAdvancedSearchEnabled() ?
                <AdvancedSearchCondition scatterState={scatterState} /> :
                <DatePicker scatterState={scatterState} handleDateChange={handleDateChange} />}
            <AddCircleOutlineIcon
                id='advanced-search'
                color='primary'
                onClick={handleAdvancedSearchIconClick} />
            <AdvancedSearchDialog
                scatterState={scatterState}
                show={showAdvancedSearchDialog}
                setShow={setShowAdvancedSearchDialog}
                search={handleSearchConditionChange} />
        </div>
    );
}
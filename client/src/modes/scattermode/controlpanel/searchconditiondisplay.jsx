import React from 'react';
import dayjs from 'dayjs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box } from '@mui/system';
import { SearchCondition } from '../searchcondition';
import { loadTracks } from '../trackloader';
import { TrackGroupSelection } from '../trackGroupSelection';
import { TrackPoint } from '../trackpoint';
import { AdvancedSearchDialog } from '../advancedsearch/advancedsearchdialog';
import { AdvancedSearchCondition } from './advancedsearchcondition';
import { DatePicker } from './datepicker';
import * as CesiumMap from '../../../cesiummap';
import './searchconditiondisplay.css';

const initializeSearchCondition = () => {
    const condition = new SearchCondition();
    if (window.location.search === '') {
        return condition;
    }
    const params = new URLSearchParams(window.location.search);
    condition.from = dayjs(params.get('from')).startOf('day');
    condition.to = dayjs(params.get('to')).endOf('day');
    condition.pilotname = params.get('pilotname') || '';
    condition.maxAltitude = parseInt(params.get('maxAltitude')) || undefined;
    condition.distance = parseFloat(params.get('distance')) || undefined;
    condition.duration = parseFloat(params.get('duration')) || undefined;
    condition.activities = params.get('activities') ? params.get('activities').split(',') : undefined;
    const boundsStrArray = params.get('bounds') ? params.get('bounds').split(',') : [];
    const boundsArray = [];
    for (const value of boundsStrArray) {
        const float = parseFloat(value);
        if (isNaN(float)) {
            condition.bounds = undefined;
            break;
        }
        boundsArray.push(float);
    };
    condition.bounds =
        boundsArray.length !== 4 ? undefined : [[boundsArray[0], boundsArray[1]], [boundsArray[2], boundsArray[3]]];
    return condition;
}

const setUrl = (searchCondition) => {
    let location = `?from=${searchCondition.from.format('YYYY-MM-DD')}`;
    location += `&to=${searchCondition.to.format('YYYY-MM-DD')}`;
    if (searchCondition.pilotname !== '') location += `&pilotname=${searchCondition.pilotname}`;
    if (searchCondition.maxAltitude !== undefined) location += `&maxAltitude=${searchCondition.maxAltitude}`;
    if (searchCondition.distance !== undefined) location += `&distance=${searchCondition.distance}`;
    if (searchCondition.duration !== undefined) location += `&duration=${searchCondition.duration}`;
    if (searchCondition.activities.length !== 0) location += `&activities=${searchCondition.activities.join(',')}`;
    if (searchCondition.bounds !== undefined) location += `&bounds=${searchCondition.bounds}`;

    history.replaceState(null, '', location);
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

    const handleTodayIconClick = React.useCallback(() => {
        const date = dayjs();
        const copySearchCondition = searchCondition;
        copySearchCondition.from = date.startOf('day');
        copySearchCondition.to = date.endOf('day');
        handleSearchConditionChange(copySearchCondition);
    });

    return (
        <Box id='search-condition-container'>
            {searchCondition.isAdvancedSearchEnabled() ?
                <AdvancedSearchCondition searchCondition={searchCondition} /> :
                <DatePicker date={searchCondition.from} handleDateChange={handleDateChange} handleTodayIconClick={handleTodayIconClick} showTodayButton={true} />}
            <AddCircleOutlineIcon
                id='advanced-search'
                color='primary'
                onClick={handleAdvancedSearchIconClick} />
            <AdvancedSearchDialog
                searchCondition={searchCondition}
                show={showAdvancedSearchDialog}
                setShow={setShowAdvancedSearchDialog}
                search={handleSearchConditionChange} />
        </Box>
    );
}
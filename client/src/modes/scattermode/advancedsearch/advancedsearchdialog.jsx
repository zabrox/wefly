import React from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogActions, DialogTitle, TextField, Grid, Button, Typography, Box } from '@mui/material';
import { DatePicker } from '../controlpanel/datepicker';
import { SearchCondition } from '../searchcondition';
import InfoIcon from '@mui/icons-material/Info';
import { ActivitiesSearch } from './activitiessearch';
import { LocationPickDialog } from './locationpickdialog';
import './advancedsearchdialog.css';

export const AdvancedSearchDialog = ({ searchCondition, show, setShow, search }) => {
    const [internalSearchCondition, setInternalSearchCondition] = React.useState(new SearchCondition(searchCondition));
    const [showLocationPickDialog, setShowLocationPickDialog] = React.useState(false);

    const handleCancelClick = () => {
        setShow(false);
    }
    const handleSearchClick = React.useCallback(() => {
        setShow(false);
        search(internalSearchCondition);
    }, [searchCondition, internalSearchCondition, search]);
    const handleFromDateChange = React.useCallback((newDate) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.from = dayjs(newDate).startOf('day');
        setInternalSearchCondition(copySearchCondition);
    }, [searchCondition, internalSearchCondition]);
    const handleToDateChange = React.useCallback((newDate) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.to = dayjs(newDate).endOf('day');
        setInternalSearchCondition(copySearchCondition);
    }, [searchCondition, internalSearchCondition]);
    const handlePilotnameChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.pilotname = e.target.value;
        setInternalSearchCondition(copySearchCondition);
    }, [searchCondition, internalSearchCondition]);
    const handleMaxAltChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.maxAltitude = e.target.value === '' ? undefined : e.target.value;
        setInternalSearchCondition(copySearchCondition);
    }, [searchCondition, internalSearchCondition]);
    const handleDistanceChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.distance = e.target.value === '' ? undefined : e.target.value;
        setInternalSearchCondition(copySearchCondition);
    }, [searchCondition, internalSearchCondition]);
    const handleDurationChange = React.useCallback((e) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.duration = e.target.value === '' ? undefined : e.target.value;
        setInternalSearchCondition(copySearchCondition);
    }, [searchCondition, internalSearchCondition]);
    const handleLocationSelect = React.useCallback((bounds) => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.bounds = bounds;
        setInternalSearchCondition(copySearchCondition);
    }, [internalSearchCondition]);
    const handleClearLocation = React.useCallback(() => {
        const copySearchCondition = new SearchCondition(internalSearchCondition);
        copySearchCondition.bounds = undefined;
        setInternalSearchCondition(copySearchCondition);
    }, [internalSearchCondition]);

    return (
        <Dialog open={show} >
            <DialogTitle>高度な検索</DialogTitle>
            <DialogContent id='advanced-search-dialog-content'>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <DatePicker
                            label="From"
                            date={searchCondition.from}
                            handleDateChange={handleFromDateChange}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            label="To"
                            date={searchCondition.to}
                            handleDateChange={handleToDateChange}
                        />
                    </Grid>
                    <ActivitiesSearch searchCondition={internalSearchCondition} setSearchCondition={setInternalSearchCondition} />
                    <Grid item>
                        <TextField
                            label="パイロット名"
                            onChange={handlePilotnameChange}
                            defaultValue={internalSearchCondition.pilotname} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="最高高度≧ (m)"
                            type="number"
                            onChange={handleMaxAltChange}
                            defaultValue={internalSearchCondition.maxAltitude} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="距離≧ (km)"
                            type="number"
                            onChange={handleDistanceChange}
                            defaultValue={internalSearchCondition.distance} />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="飛行時間≧ (分)"
                            type="number"
                            onChange={handleDurationChange}
                            defaultValue={internalSearchCondition.duration} />
                    </Grid>
                    <Grid item>
                        <Typography>スタート位置で検索</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => setShowLocationPickDialog(true)}>ロケーションを選択</Button>
                        <Button onClick={handleClearLocation}>クリア</Button>
                        <LocationPickDialog
                            searchCondition={internalSearchCondition}
                            open={showLocationPickDialog}
                            onClose={() => { setShowLocationPickDialog(false) }}
                            onConfirm={handleLocationSelect} />
                    </Grid>
                    <Grid item>
                        <TextField label="緯度" size='small' value={internalSearchCondition.bounds ? internalSearchCondition.bounds[0][1] : ""} />
                    </Grid>
                    <Grid item>
                        <TextField label="経度" size='small' value={internalSearchCondition.bounds ? internalSearchCondition.bounds[0][0] : ""} />
                    </Grid>
                    <Grid item>
                        <Box style={{ display: 'flex' }}>
                            <InfoIcon color='primary' style={{ paddingRight: '5px' }} />
                            <Typography>最大検索件数は1000件です</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid item>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item>
                            <Button variant="outlined" onClick={handleCancelClick}>CANCEL</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={handleSearchClick}>検索</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog >
    );
};

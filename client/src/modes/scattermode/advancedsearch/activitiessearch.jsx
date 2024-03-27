import React from 'react';
import { Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { SearchCondition } from '../searchcondition';
import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';

const activities = [
    { name: 'Paraglider', element: <img src={ParagliderIcon} /> },
    { name: 'Hangglider', element: <img src={HanggliderIcon} /> },
    { name: 'Glider', element: <img src={GliderIcon} /> },
    { name: 'Other', element: <div style={{width: '32px'}}></div> }
];

export const ActivitiesSearch = ({ searchCondition, setSearchCondition }) => {
    const handleSelectionChange = React.useCallback((e, value) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.activities = value;
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    return (
        <Grid item>
            <ToggleButtonGroup size='small'
                color='primary'
                value={searchCondition.activities}
                onChange={handleSelectionChange}>
                {activities.map((activity) => (
                    <ToggleButton key={activity.name} value={activity.name}>
                        {activity.element}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Grid>
    )
}

import React from 'react';
import { Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { primaryColor, secondaryColor } from '../../../colortheme';
import { SearchCondition } from '../searchcondition';
import ParagliderIcon from '/images/paraglider.svg';
import GliderIcon from '/images/glider.svg';
import HanggliderIcon from '/images/hangglider.svg';

const SIZE = 32;
const ICON_SIZE = SIZE * 0.6;
const activities = [
    { name: 'Paraglider', src: ParagliderIcon, alt: 'Paraglider' },
    { name: 'Hangglider', src: HanggliderIcon, alt: 'Hangglider' },
    { name: 'Glider', src: GliderIcon, alt: 'Glider' },
    { name: 'Other', src: undefined, alt: 'Other' },
];

export const ActivitiesSearch = ({ searchCondition, setSearchCondition }) => {
    const handleSelectionChange = React.useCallback((e, value) => {
        const copySearchCondition = new SearchCondition(searchCondition);
        copySearchCondition.activities = value;
        setSearchCondition(copySearchCondition);
    }, [searchCondition]);
    return (
        <Grid item>
            <ToggleButtonGroup
                size='small'
                color='primary'
                value={searchCondition.activities}
                onChange={handleSelectionChange}
                sx={(theme) => ({
                    '& .MuiToggleButtonGroup-grouped': {
                        marginRight: 1,
                        border: '1px solid',
                        borderColor: theme.palette.grey[400],
                        borderRadius: '50% !important',
                        boxSizing: 'border-box',
                        padding: 0,
                        width: `${SIZE}px`,
                        height: `${SIZE}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)',
                            borderColor: theme.palette.grey[500],
                        },
                        '&.Mui-selected': {
                            backgroundColor: primaryColor,
                            color: secondaryColor,
                            borderColor: 'transparent',
                            '&:hover': {
                                backgroundColor: primaryColor,
                            }
                        }
                    }
                })}
            >
                {activities.map((activity) => (
                    <ToggleButton key={activity.name} value={activity.name}>
                        {activity.src ? (
                            <img
                                src={activity.src}
                                alt={activity.alt}
                                style={{ width: `${ICON_SIZE}px`, height: `${ICON_SIZE}px` }}
                            />
                        ) : (
                            <div style={{ width: `${ICON_SIZE}px`, height: `${ICON_SIZE}px` }} />
                        )}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Grid>
    )
}

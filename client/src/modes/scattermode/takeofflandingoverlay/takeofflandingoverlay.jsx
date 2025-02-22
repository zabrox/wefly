import * as React from 'react';
import { Card, CardHeader, Typography } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Box } from '@mui/system';
import { Takeoff } from '../../../entities/takeoff';
import { Landing } from '../../../entities/landing';
import './takeofflandingoverlay.css';

export const TakeoffLandingOverlay = ({ scatterState }) => {

    const selectedTakeoffLanding = scatterState.selectedTakeoffLanding;
    if (selectedTakeoffLanding === undefined) {
        return null;
    }

    return (
        <Card id='takeoff-landing-overlay'>
            <CardHeader sx={{ padding: '10px 10px 10px 10px' }}
                avatar={
                    <div style={{ margin: '0px 0px 0px 10px' }}>
                        {selectedTakeoffLanding instanceof Takeoff && <FlightTakeoffIcon />}
                        {selectedTakeoffLanding instanceof Landing && <FlightLandIcon />}
                    </div>
                }
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h6' style={{ padding: '0px 0px 10px' }}>{selectedTakeoffLanding.name}</Typography>
                    </div>
                }
                subheader={
                    <Box>
                        <Box id='takeoff-landing-info-wrapprer' style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingBottom: '5px' }}>
                            {selectedTakeoffLanding.organization !== undefined &&
                                <Typography variant='body2' color='text.secondary' class='takeoff-landing-info'>
                                    <HomeOutlinedIcon /> {selectedTakeoffLanding.organization}
                                </Typography>
                            }
                            <Typography variant='body2' color='text.secondary'  class='takeoff-landing-info'>
                                <LandscapeOutlinedIcon /> {selectedTakeoffLanding.altitude}m
                            </Typography>
                            {selectedTakeoffLanding.direction !== undefined &&
                                <Typography variant='body2' color='text.secondary' class='takeoff-landing-info'>
                                    <ExploreOutlinedIcon /> {selectedTakeoffLanding.direction}
                                </Typography>
                            }
                        </Box>
                    </Box>
                } />
        </Card>
    )
}
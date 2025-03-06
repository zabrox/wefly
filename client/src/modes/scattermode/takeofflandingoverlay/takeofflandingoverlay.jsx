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

    const organization = selectedTakeoffLanding.organization;
    const homepage = scatterState.organizations.find(org => org.name === organization)?.homepage;

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
                            {organization !== null &&
                                <Typography variant='body2' color='text.secondary' className='takeoff-landing-info'>
                                    {homepage === "" ?
                                        <HomeOutlinedIcon /> :
                                        <img src={"http://www.google.com/s2/favicons?domain=" + homepage} />
                                    }
                                    {homepage === "" ?
                                        <Box>{organization}</Box> :
                                        <a href={homepage} target="_blank">{organization}</a>
                                    }
                                </Typography>
                            }
                            <Typography variant='body2' color='text.secondary' className='takeoff-landing-info'>
                                <LandscapeOutlinedIcon /> {selectedTakeoffLanding.altitude}m
                            </Typography>
                            {selectedTakeoffLanding.direction !== undefined &&
                                <Typography variant='body2' color='text.secondary' className='takeoff-landing-info'>
                                    <ExploreOutlinedIcon /> {selectedTakeoffLanding.direction}
                                </Typography>
                            }
                        </Box>
                    </Box>
                } />
        </Card>
    )
}
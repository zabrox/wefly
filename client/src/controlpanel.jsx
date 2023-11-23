import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import { Checkbox } from '@mui/material';
import './controlpanel.css';
import { Tab } from '@mui/material';

export const ControlPanel = (props) => {
    return (
        <div className="control-panel">
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Max Alt.</TableCell>
                            <TableCell>Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody> {
                        props.tracks.map((track, i) => {
                            return (
                                <TableRow key={"tr" + i}>
                                    <TableCell>
                                        <Checkbox color="primary" checked={track.show} onChange={() => props.onChange(track.id)} />
                                    </TableCell>
                                    <TableCell key={"track-color-td" + i}>
                                        <div className="track-color" key={"track-color" + i} style={{ backgroundColor: track.color.toCssHexString() }}>　</div>
                                    </TableCell>
                                    <TableCell className="trackname" key={track.name}>{track.name}</TableCell>
                                    <TableCell className="maxalt" key={track.name + "maxalt"}>{track.maxAltitude()}m</TableCell>
                                    <TableCell className="duration" key={track.name + "duration"}>{track.duration()}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
};
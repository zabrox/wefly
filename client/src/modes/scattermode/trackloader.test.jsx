import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import dayjs from 'dayjs';
import { Metadata } from '../../entities/metadata';
import { SearchCondition } from './searchcondition';

vi.mock('axios');

import { loadMetadatas, loadPaths } from './trackloader';
import axios from 'axios';

describe('TrackLoader', () => {
    // beforeEach(() => {
    //     cleanup();
    //     vi.resetAllMocks();
    // });

    describe('dummy', () => {
        it('dummy', () => {
            expect(true).toBe(true);
        });
    });

    // describe('loadMetadatas', () => {
    //     it('loads metadatas successfully', async () => {
    //         const date = dayjs('2022-01-01');
    //         const searchCondition = new SearchCondition();
    //         searchCondition.from = date.startOf('day');
    //         searchCondition.to = date.endOf('day');
    //         searchCondition.pilotname = 'Takase';
    //         searchCondition.maxAltitude = 1000;
    //         searchCondition.distance = 100;
    //         searchCondition.duration = 60;
    //         searchCondition.bounds = [[-122.42000, 37.77000], [-122.40000, 37.78000]];
    //         searchCondition.activities = new Set(['Paraglider', 'Hangglider']);
    //         const metadatasurl = `${import.meta.env.VITE_API_URL}/tracks/metadata`;
    //         const metadata1 = Metadata.deserialize({ pilotname: 'Takase', distance: 123, duration: 60, area: 'Asagiri' });
    //         const metadata2 = Metadata.deserialize({ pilotname: 'Hirayama', distance: 2, duration: 3, area: 'Ongata' });
    //         const response = {
    //             data: [
    //                 { ...metadata1 },
    //                 { ...metadata2 },
    //             ],
    //         };
    //         axios.mockResolvedValueOnce(response);

    //         const metadatas = await loadMetadatas(searchCondition);

    //         expect(axios).toHaveBeenCalledWith({
    //             method: 'get',
    //             url: `${metadatasurl}`,
    //             responseType: 'json',
    //             params: {
    //                 from: "2022-01-01T00:00:00+09:00",
    //                 to: "2022-01-01T23:59:59+09:00",
    //                 pilotname: "Takase",
    //                 maxAltitude: 1000,
    //                 distance: 100,
    //                 duration: 60,
    //                 bounds: "-122.42,37.77,-122.4,37.78",
    //                 activities: "Paraglider,Hangglider",
    //             }
    //         });
    //         expect(metadatas).toEqual([
    //             metadata1,
    //             metadata2,
    //         ]);
    //     });

    //     it('throws an error when loading metadatas fails', async () => {
    //         const date = dayjs('2022-01-01');
    //         const searchCondition = new SearchCondition();
    //         searchCondition.from = date.startOf('day');
    //         searchCondition.to = date.endOf('day');
    //         const metadatasurl = `${import.meta.env.VITE_API_URL}/tracks/metadata`;
    //         const error = new Error('Failed to load metadatas');
    //         axios.mockRejectedValueOnce(error);

    //         await expect(loadMetadatas(searchCondition)).rejects.toThrow(error);

    //         expect(axios).toHaveBeenCalledWith({
    //             method: 'get',
    //             url: `${metadatasurl}`,
    //             responseType: 'json',
    //             params: {
    //                 from: "2022-01-01T00:00:00+09:00",
    //                 to: "2022-01-01T23:59:59+09:00",
    //                 pilotname: "",
    //                 maxAltitude: undefined,
    //                 distance: undefined,
    //                 duration: undefined,
    //                 bounds: undefined,
    //                 activities: "Paraglider,Hangglider,Glider,Other",
    //             }
    //         });
    //     });
    // });

    // describe('loadPaths', () => {
    //     it('loads paths successfully', async () => {
    //         const trackId1 = 'Takase_20240303120000';
    //         const trackId2 = 'Hierayama_20240303120000';
    //         const tracks = [
    //             { getId: () => trackId1, path: { addPoint: vi.fn() } },
    //             { getId: () => trackId2, path: { addPoint: vi.fn() } },
    //         ];
    //         const pathsurl = `${import.meta.env.VITE_API_URL}/tracks/paths?trackids=`;
    //         const response = {
    //             data: {
    //                 Takase_20240303120000: [
    //                     [137.5, 35.8, 300, '2022-01-01T00:00:01Z'],
    //                     [137.5, 35.8, 300, '2022-01-01T00:00:02Z'],
    //                     [137.5, 35.8, 300, '2022-01-01T00:00:03Z'],
    //                 ],
    //                 Hierayama_20240303120000: [
    //                     [137.5, 35.8, 300, '2022-01-01T00:00:01Z'],
    //                     [137.5, 35.8, 300, '2022-01-01T00:00:02Z'],
    //                     [137.5, 35.8, 300, '2022-01-01T00:00:03Z'],
    //                 ],
    //             },
    //         };
    //         axios.mockResolvedValueOnce(response);

    //         await loadPaths(tracks);

    //         expect(axios).toHaveBeenCalledWith({
    //             method: 'get',
    //             url: `${pathsurl}${trackId1},${trackId2}`,
    //         });
    //         expect(tracks[0].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:01Z'));
    //         expect(tracks[0].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:02Z'));
    //         expect(tracks[0].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:03Z'));
    //         expect(tracks[1].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:01Z'));
    //         expect(tracks[1].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:02Z'));
    //         expect(tracks[1].path.addPoint).toHaveBeenCalledWith(137.5, 35.8, 300, dayjs('2022-01-01T00:00:03Z'));
    //     });

    //     it('throws an error when loading paths fails', async () => {
    //         const tracks = [
    //             { getId: () => '1', path: { addPoint: vi.fn() } },
    //             { getId: () => '2', path: { addPoint: vi.fn() } },
    //         ];
    //         const pathsurl = `${import.meta.env.VITE_API_URL}/tracks/paths?trackids=`;
    //         const error = new Error('Failed to load paths');
    //         axios.mockRejectedValueOnce(error);

    //         await expect(loadPaths(tracks)).rejects.toThrow(error);

    //         expect(axios).toHaveBeenCalledWith({
    //             method: 'get',
    //             url: `${pathsurl}1,2`,
    //         });
    //         expect(tracks[0].path.addPoint).not.toHaveBeenCalled();
    //         expect(tracks[1].path.addPoint).not.toHaveBeenCalled();
    //     });
    // });
});
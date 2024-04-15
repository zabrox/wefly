const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { Storage } = require('@google-cloud/storage');
const { parseIgc } = require('./igcParser.js');
const { Track } = require('./common/track.js');

dayjs.extend(utc);
jest.mock('@google-cloud/storage');

describe('igcParser', () => {
    const date = '2024-02-08';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse IGC files for each track', async () => {
        const track = new Track();
        track.metadata.pilotname = 'ashida';
        track.metadata.startTime = dayjs('2024-02-08T02:01:25Z');
        track.metadata.lastTime = dayjs('2024-02-08T02:02:07Z');
        const igcFilePath = path.join('test_assets', 'ashida_20231001020125.igc');
        const igcContent = fs.readFileSync(igcFilePath);

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValueOnce([Buffer.from(igcContent)]),
                }),
            }),
        }));

        await parseIgc(date, track);

        expect(track.metadata.startTime).toStrictEqual(dayjs('2024-02-08T02:01:25.000Z'));
        expect(track.metadata.lastTime).toStrictEqual(dayjs('2024-02-08T02:02:07.000Z'));
        expect(track.metadata.startPosition).toStrictEqual([134.97935, 35.239866666666664, 685]);
        expect(track.metadata.lastPosition).toStrictEqual([134.9794, 35.23983333333334, 681]);
        expect(track.metadata.maxAltitude).toBe(685);
    });

    it('when track is cross 0 oclock', async () => {
        const track = new Track();
        track.metadata.pilotname = 'ashida';
        track.metadata.startTime = dayjs('2024-02-07T23:59:59Z');
        track.metadata.lastTime = dayjs('2024-02-08T00:00:01Z');
        const igcFilePath = path.join('test_assets', 'cross_0_oclock.igc');
        const igcContent = fs.readFileSync(igcFilePath);

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValueOnce([Buffer.from(igcContent)]),
                }),
            }),
        }));

        await parseIgc(date, track);

        expect(track.metadata.startTime).toStrictEqual(dayjs('2024-02-07T23:59:59.000Z'));
        expect(track.metadata.lastTime).toStrictEqual(dayjs('2024-02-08T00:00:01.000Z'));
        expect(track.metadata.startPosition).toStrictEqual([134.97935, 35.239866666666664, 685]);
        expect(track.metadata.lastPosition).toStrictEqual([134.9794, 35.23983333333334, 681]);
        expect(track.metadata.maxAltitude).toBe(685);
    });
});
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { Storage } = require('@google-cloud/storage');
const { parseTrackListPage } = require('./trackListPageParser.js');
const { Track } = require('./common/track.js');

dayjs.extend(utc)

jest.mock('@google-cloud/storage');

describe('TrackListPageParser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse tracks from HTML', async () => {
        const htmlFilePath = path.join('test_assets', '2024-02-08_TrackListPage-1.html');
        const htmlContent = fs.readFileSync(htmlFilePath);
        const mockExists = jest.fn().mockResolvedValueOnce([true]).mockResolvedValue([false]);

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValueOnce([Buffer.from(htmlContent)]),
                    exists: mockExists,
                }),
            }),
        }));

        const tracks = await parseTrackListPage('2024-02-08', 1);
        expect(tracks.length).toBe(10);

        const expected = new Track();
        expected.metadata.pilotname = 'flyhiwa';
        expected.metadata.distance = 7.7;
        expected.metadata.lastTime = dayjs.utc('2024-02-08 07:50:59.000');
        expected.metadata.activity = 'Paraglider';
        expected.metadata.duration = 168;
        expected.metadata.startTime = undefined;
        expected.metadata.startPosition = undefined;
        expected.metadata.lastPosition = undefined;
        expected.metadata.liveTrackId = '2552840';
        expect(tracks[0]).toStrictEqual(expected);
    });

    it('should parse live tracks from HTML', async () => {
        const htmlFilePath = path.join('test_assets', 'TrackListPage-Live.html');
        const htmlContent = fs.readFileSync(htmlFilePath);
        const mockExists = jest.fn().mockResolvedValueOnce([true]).mockResolvedValue([false]);

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValueOnce([Buffer.from(htmlContent)]),
                    exists: mockExists,
                }),
            }),
        }));

        const tracks = await parseTrackListPage('2024-02-08', 1);
        expect(tracks.length).toBe(0);
    });
});

const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { Storage } = require('@google-cloud/storage');
const { parseTrackPages } = require('./trackPageParser.js');
const { Track } = require('./entity/track.js');

jest.mock('@google-cloud/storage');

describe('parseTrackPages', () => {
    const date = '2024-02-08';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse track page for each track', async () => {
        const tracks = [new Track()];
        tracks[0].metadata.pilotname = 'Mt791';
        tracks[0].metadata.lastTime = dayjs('2024-02-13T04:32:12Z');
        const filePath = path.join('test_assets', 'TrackPage-Mt791_20240213043212.html');
        const content = fs.readFileSync(filePath);

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValueOnce([Buffer.from(content)]),
                    exists: jest.fn().mockResolvedValue([true]),
                }),
            }),
        }));

        await parseTrackPages(date, tracks);

        expect(tracks[0].metadata.model).toBe('Cure');
    });

    it('should not parse track if track page does not exist', async () => {
        const tracks = [new Track()];
        tracks[0].metadata.pilotname = 'Mt791';
        tracks[0].metadata.lastTime = dayjs('2024-02-13T04:32:12Z');
        const downloadMock = jest.fn();

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: downloadMock,
                    exists: jest.fn().mockResolvedValue([false]),
                }),
            }),
        }));

        await parseTrackPages(date, tracks);

        expect(downloadMock.mock.calls.length).toBe(0);
        expect(tracks[0].metadata.model).toBe("");
    });
});
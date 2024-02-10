const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const cheerio = require('cheerio');
const { parseTrackListPage } = require('./trackListPageParser.js');

jest.mock('@google-cloud/storage');

describe('TrackListPageParser', () => {
    beforeAll(async () => {
        const htmlFilePath = path.join('test_assets', '2024-02-08_TrackListPage-1.html');
        const htmlContent = fs.readFileSync(htmlFilePath);

        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValueOnce([Buffer.from(htmlContent)]),
                }),
            }),
        }));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse tracks from HTML', async () => {
        const tracks = await parseTrackListPage('2024-02-08', 1);
        expect(tracks.length).toBe(1);
    });
});

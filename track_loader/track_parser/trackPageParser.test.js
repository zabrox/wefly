const { Storage } = require('@google-cloud/storage');
const { TrackPageParser } = require('./trackPageParser');
const { TrackPageData } = require('./entity/trackPageData');
jest.mock('@google-cloud/storage');

describe('TrackPageParser', () => {
    it('should parse track page data successfully', async () => {
        const date = '2023-10-10';
        const trackId = '12345';
        const htmlData = `
            <html>
                <div id="row2_1">
                    <h3>ModelName</h3>
                    <img alt="ActivityName" />
                </div>
                <div class="pageheader">
                    <a>PilotName - Some other text</a>
                </div>
                <div id="averagePace">
                    <span>123.45</span>
                </div>
            </html>
        `;
        const mockFile = { exists: jest.fn().mockResolvedValue([true]), download: jest.fn().mockResolvedValue([Buffer.from(htmlData)]) };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const parser = new TrackPageParser(date, trackId);
        const trackPageData = await parser.parseTrackPage();

        expect(mockStorage.bucket).toHaveBeenCalledWith('wefly-lake');
        expect(mockBucket.file).toHaveBeenCalledWith(`${date}/livetrack24/TrackPage-${trackId}.html`);
        expect(mockFile.exists).toHaveBeenCalled();
        expect(mockFile.download).toHaveBeenCalled();

        const expectedData = new TrackPageData();
        expectedData.model = 'ModelName';
        expectedData.activity = 'ActivityName';
        expectedData.pilotname = 'PilotName';
        expectedData.distance = 123.45;

        expect(trackPageData).toEqual(expectedData);
    });

    it('should handle error during file download', async () => {
        const date = '2023-10-10';
        const trackId = '12345';
        const mockFile = { exists: jest.fn().mockResolvedValue([true]), download: jest.fn().mockRejectedValue(new Error('Download error')) };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const parser = new TrackPageParser(date, trackId);

        await expect(parser.parseTrackPage()).rejects.toThrow('Download error');

        expect(mockStorage.bucket).toHaveBeenCalledWith('wefly-lake');
        expect(mockBucket.file).toHaveBeenCalledWith(`${date}/livetrack24/TrackPage-${trackId}.html`);
        expect(mockFile.exists).toHaveBeenCalled();
        expect(mockFile.download).toHaveBeenCalled();
    });
});

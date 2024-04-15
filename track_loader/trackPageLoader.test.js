const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
const { loadTrackPages } = require('./trackPageLoader');

jest.mock('axios');
jest.mock('@google-cloud/storage');

describe('loadTrackPages', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should download and save track pages for each track', async () => {
        axios.get.mockResolvedValue({ status: 200, data: '<html></html>' });
        const mockUpload = jest.fn();
        Storage.mockImplementation(() => ({
            bucket: () => ({
                upload: mockUpload,
                file: () => ({
                    exists: jest.fn().mockResolvedValue([false]),
                }),
            }),
        }));
        const tracks = [{ getId: jest.fn().mockReturnValue('Takase_12345'), metadata: { liveTrackId: '2552840' } }];
        const opts = { force: false };

        await loadTrackPages('2024-02-08', tracks, opts);

        expect(axios.get.mock.calls.length).toBe(1);
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/track/2552840', expect.anything());
        expect(mockUpload.mock.calls.length).toBe(1);
        expect(mockUpload).toBeCalledWith('./2024-02-08/livetrack24/TrackPage-2552840.html', expect.anything());
    });

    it('should not download track pages if it already exists', async () => {
        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    exists: jest.fn().mockResolvedValue([true]),
                }),
            }),
        }));
        const tracks = [{ getId: jest.fn().mockReturnValue('Takase_12345'), metadata: { liveTrackId: '2552840' } }];
        const opts = { force: false };

        await loadTrackPages('2024-02-08', tracks, opts);

        expect(axios.get.mock.calls.length).toBe(0);
    });

    it('should download track pages on force mode even if it already exists', async () => {
        axios.get.mockResolvedValue({ status: 200, data: '<html></html>' });
        const mockUpload = jest.fn();
        Storage.mockImplementation(() => ({
            bucket: () => ({
                upload: mockUpload,
                file: () => ({
                    exists: jest.fn().mockResolvedValue([true]),
                }),
            }),
        }));
        const tracks = [{ getId: jest.fn().mockReturnValue('Takase_12345'), metadata: { liveTrackId: '2552840' } }];
        const opts = { force: true };

        await loadTrackPages('2024-02-08', tracks, opts);

        expect(axios.get.mock.calls.length).toBe(1);
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/track/2552840', expect.anything());
        expect(mockUpload.mock.calls.length).toBe(1);
        expect(mockUpload).toBeCalledWith('./2024-02-08/livetrack24/TrackPage-2552840.html', expect.anything());
    });
});
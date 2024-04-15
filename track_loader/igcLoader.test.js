const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
const { loadIgcs } = require('./igcLoader.js');

jest.mock('axios');
jest.mock('@google-cloud/storage');

describe('igcLoader', () => {
    const date = '2024-02-08';
    const tracks = [{
        getId: jest.fn().mockReturnValue('12345'),
        metadata: {
            liveTrackId: '2552840',
        },
    }];
    const bucketName = 'your-bucket-name';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load IGC file if it does not exist', async () => {
        const saveMock = jest.fn().mockResolvedValueOnce();
        const existsMock = jest.fn().mockResolvedValueOnce([false]);
        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    save: saveMock,
                    exists: existsMock,
                }),
            }),
        }));

        const getMock = jest.fn().mockResolvedValueOnce({
            status: 200,
            data: 'mock igc data',
        });
        axios.get.mockImplementationOnce(getMock);

        await loadIgcs(date, tracks, { force: false });

        expect(getMock).toHaveBeenCalledWith(`https://www.livetrack24.com/leo_live.php?op=igc&trackID=${tracks[0].metadata.liveTrackId}`, expect.anything());
        expect(saveMock).toHaveBeenCalledWith('mock igc data');
    });

    it('should not load IGC file if it already exists', async () => {
        const saveMock = jest.fn().mockResolvedValueOnce();
        const existsMock = jest.fn().mockResolvedValueOnce([true]);
        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    save: saveMock,
                    exists: existsMock,
                }),
            }),
        }));

        await loadIgcs(date, tracks, { force: false });

        expect(existsMock).toHaveBeenCalled();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should handle error when downloading or saving IGC file', async () => {
        const saveMock = jest.fn().mockResolvedValueOnce();
        const existsMock = jest.fn().mockResolvedValueOnce([false]);
        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    save: saveMock,
                    exists: existsMock,
                }),
            }),
        }));
        const getMock = jest.fn().mockResolvedValueOnce({
            status: 500,
        });
        axios.get.mockImplementationOnce(getMock);

        await loadIgcs(date, tracks, { force: false });

        expect(getMock).toHaveBeenCalledWith(`https://www.livetrack24.com/leo_live.php?op=igc&trackID=${tracks[0].metadata.liveTrackId}`, expect.anything());
        expect(saveMock).not.toHaveBeenCalled();
    });

    it('should load IGC file even if it already exists when force mode', async () => {
        const saveMock = jest.fn().mockResolvedValueOnce();
        const existsMock = jest.fn().mockResolvedValueOnce([true]);
        Storage.mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    save: saveMock,
                    exists: existsMock,
                }),
            }),
        }));

        await loadIgcs(date, tracks, { force: true });

        expect(existsMock).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalled();
    });

});
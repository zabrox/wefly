// trackListPageLoader.test.js
const axios = require('axios');
const { Storage } = require('@google-cloud/storage');
const { loadTrackListPages } = require('./trackListPageLoader');

jest.mock('axios');

jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn(() => ({
            bucket: () => ({
                upload: jest.fn(),
            })
        })),
    };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TrackListPageLoader', () => {
    it('parse empty page', async () => {
        axios.get.mockResolvedValue({ status: 200, data: '<html></html>' });
        const mockUpload = jest.fn();
        Storage.mockImplementation(() => ({
            bucket: () => ({
                upload: mockUpload,
            }),
        }));

        await loadTrackListPages('2024-02-08');

        expect(axios.get.mock.calls.length).toBe(1);
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/tracks/country/jp/from/2024-02-08/to/2024-02-08/page_num/1/', expect.anything());
        expect(mockUpload.mock.calls.length).toBe(0);
    });

    it('parse page with 2 entries', async () => {
        axios.get.mockResolvedValue({
            status: 200, data: '<html> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_def456"></div> \
        </html>' });

        const mockUpload = jest.fn();
        Storage.mockImplementation(() => ({
            bucket: () => ({
                upload: mockUpload,
            }),
        }));

        await loadTrackListPages('2024-02-08');

        expect(axios.get.mock.calls.length).toBe(1);
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/tracks/country/jp/from/2024-02-08/to/2024-02-08/page_num/1/', expect.anything());
        const path = '2024-02-08/TrackListPage-1.html';
        expect(mockUpload).toBeCalledWith(`./${path}`, { destination: path });
    });

    it('parse with pagenation', async () => {
        axios.get.mockResolvedValueOnce({
            status: 200, data: '<html> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        <div id="trackRow_abc123"></div> \
        </html>' });
        axios.get.mockResolvedValueOnce({
            status: 200, data: '<html> \
        <div id="trackRow_abc123"></div> \
        </html' });

        const mockUpload = jest.fn();
        Storage.mockImplementation(() => ({
            bucket: () => ({
                upload: mockUpload,
            }),
        }));

        await loadTrackListPages('2024-02-08');

        expect(axios.get.mock.calls.length).toBe(2);
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/tracks/country/jp/from/2024-02-08/to/2024-02-08/page_num/1/', expect.anything());
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/tracks/country/jp/from/2024-02-08/to/2024-02-08/page_num/2/', expect.anything());
        expect(mockUpload.mock.calls.length).toBe(2);
    });

    it('livetrack returns error', async () => {
        axios.get.mockResolvedValueOnce({
            status: 404, data: '' });

        const mockUpload = jest.fn();
        Storage.mockImplementation(() => ({
            bucket: () => ({
                upload: mockUpload,
            }),
        }));

        await loadTrackListPages('2024-02-08');

        expect(axios.get.mock.calls.length).toBe(1);
        expect(axios.get).toBeCalledWith('https://www.livetrack24.com/tracks/country/jp/from/2024-02-08/to/2024-02-08/page_num/1/', expect.anything());
        expect(mockUpload.mock.calls.length).toBe(0);
    });
});

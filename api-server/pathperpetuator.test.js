const { Storage } = require('@google-cloud/storage');
jest.mock('@google-cloud/storage');
const { PathPerpetuator } = require('./pathperpetuator.js');

describe('PathPerpetuator', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetch should return paths for given track IDs', async () => {
        const trackIds = ['track1', 'track2', 'track3'];

        const mockBucket = {
            file: jest.fn().mockReturnThis(),
            download: jest.fn().mockResolvedValue([
                {
                    toString: jest.fn().mockReturnValue(JSON.stringify(
                        [
                            [138.5465, 35.37305, 1039, "2022-01-01T01:40:04.000Z"],
                            [138.54646666666667,35.37305,1037,"2022-01-01T01:40:07.000Z"],
                            [138.54646666666667,35.37305,1037,"2022-01-01T01:40:10.000Z"],
                        ]
                    ))
                }
            ])
        };
        Storage.mockImplementation(() => ({
            bucket: jest.fn().mockReturnValue(mockBucket)
        }));

        const pathPerpetuator = new PathPerpetuator();
        const result = await pathPerpetuator.fetch(trackIds);

        expect(mockBucket.file).toHaveBeenCalledTimes(3);
        expect(mockBucket.file).toHaveBeenNthCalledWith(1, 'paths/track1.json.gz');
        expect(mockBucket.file).toHaveBeenNthCalledWith(2, 'paths/track2.json.gz');
        expect(mockBucket.file).toHaveBeenNthCalledWith(3, 'paths/track3.json.gz');
        expect(mockBucket.file().download).toHaveBeenCalledTimes(3);
        const expectedPath = {
            points: [
                [138.5465, 35.37305, 1039],
                [138.54646666666667, 35.37305, 1037],
                [138.54646666666667, 35.37305, 1037],
            ],
            times: [
                "2022-01-01T01:40:04.000Z",
                "2022-01-01T01:40:07.000Z",
                "2022-01-01T01:40:10.000Z",
            ]
        };
        expect(result['track1']).toEqual(expectedPath);
        expect(result['track2']).toEqual(expectedPath);
        expect(result['track3']).toEqual(expectedPath);
    });

    test('fetch should return empty object when an error occurs', async () => {
        const trackIds = ['track1'];

        const mockBucket = {
            file: jest.fn().mockReturnThis(),
            download: jest.fn().mockRejectedValue(new Error('Download error'))
        };
        Storage.mockImplementation(() => ({
            bucket: jest.fn().mockReturnValue(mockBucket)
        }));

        const pathPerpetuator = new PathPerpetuator();
        const result = await pathPerpetuator.fetch(trackIds);

        expect(mockBucket.file).toHaveBeenCalledTimes(1);
        expect(mockBucket.file).toHaveBeenCalledWith('paths/track1.json.gz');
        expect(mockBucket.file().download).toHaveBeenCalledTimes(1);
        expect(result).toEqual({});
    });

    it('should delete path successfully', async () => {
        const trackId = 'testTrackId';
        const mockFile = { delete: jest.fn().mockResolvedValue() };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const perpetuator = new PathPerpetuator();
        await perpetuator.deletePath(trackId);

        expect(mockStorage.bucket).toHaveBeenCalledWith('wefly-mart');
        expect(mockBucket.file).toHaveBeenCalledWith(`paths/${trackId}.json.gz`);
        expect(mockFile.delete).toHaveBeenCalled();
    });

    it('should handle error during path deletion', async () => {
        const trackId = 'testTrackId';
        const mockFile = { delete: jest.fn().mockRejectedValue(new Error('Delete error')) };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const perpetuator = new PathPerpetuator();

        await expect(perpetuator.deletePath(trackId)).rejects.toThrow('Delete error');

        expect(mockStorage.bucket).toHaveBeenCalledWith('wefly-mart');
        expect(mockBucket.file).toHaveBeenCalledWith(`paths/${trackId}.json.gz`);
        expect(mockFile.delete).toHaveBeenCalled();
    });
});
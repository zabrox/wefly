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
            download: jest.fn().mockResolvedValue([{ toString: jest.fn().mockReturnValue(JSON.stringify(['a', 'b', 'c'])) }])
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
        expect(result).toEqual({
            track1: ['a', 'b', 'c'],
            track2: ['a', 'b', 'c'],
            track3: ['a', 'b', 'c'],
        });
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
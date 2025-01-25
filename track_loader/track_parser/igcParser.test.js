const { Storage } = require('@google-cloud/storage');
const { IGCParser } = require('./igcParser');
const { Path } = require('./entity/path');
jest.mock('@google-cloud/storage');

describe('IGCParser', () => {
    it('should parse IGC data successfully', async () => {
        const date = '2023-10-10';
        const trackId = '12345';
        const igcData = `
B0235143524795N13834198EA0000001186
B0235173524795N13834198EA0000001190
        `;
        const mockFile = { download: jest.fn().mockResolvedValue([Buffer.from(igcData)]) };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const parser = new IGCParser(date, trackId);
        const path = await parser.parseIGC();

        expect(mockStorage.bucket).toHaveBeenCalledWith('wefly-lake');
        expect(mockBucket.file).toHaveBeenCalledWith(`${date}/igcs/${trackId}.igc`);
        expect(mockFile.download).toHaveBeenCalled();

        const expectedPath = new Path();
        expectedPath.addPoint(138.56996666666666, 35.41325, 1186, expect.any(Object));
        expectedPath.addPoint(138.56996666666666, 35.41325, 1190, expect.any(Object));

        expect(path).toEqual(expectedPath);
    });

    it('should handle error during file download', async () => {
        const date = '2023-10-10';
        const trackId = '12345';
        const mockFile = { download: jest.fn().mockRejectedValue(new Error('Download error')) };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const parser = new IGCParser(date, trackId);

        await expect(parser.parseIGC()).rejects.toThrow('Download error');

        expect(mockStorage.bucket).toHaveBeenCalledWith('wefly-lake');
        expect(mockBucket.file).toHaveBeenCalledWith(`${date}/igcs/${trackId}.igc`);
        expect(mockFile.download).toHaveBeenCalled();
    });
});

const { Storage } = require('@google-cloud/storage');
const { GcsUploader } = require('./gcsUploader');
jest.mock('@google-cloud/storage');

describe('GcsUploader', () => {
    it('should upload data to GCS', async () => {
        const bucketName = 'wefly-lake';
        const filePath = '2023-10-10/igcs/testPilot_12345.igc';
        const data = 'mockIgcData';

        const mockFile = { save: jest.fn().mockResolvedValue() };
        const mockBucket = { file: jest.fn().mockReturnValue(mockFile) };
        const mockStorage = { bucket: jest.fn().mockReturnValue(mockBucket) };

        Storage.mockImplementation(() => mockStorage);

        const uploader = new GcsUploader(bucketName, filePath);
        await uploader.upload(data);

        expect(mockStorage.bucket).toHaveBeenCalledWith(bucketName);
        expect(mockBucket.file).toHaveBeenCalledWith(filePath);
        expect(mockFile.save).toHaveBeenCalledWith(data, {
            resumable: false,
            validation: false,
        });
    });
});

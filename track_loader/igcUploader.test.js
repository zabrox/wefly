const { uploadIgc } = require('./igcUploader');
const { GcsUploader } = require('./gcsUploader');
const { IgcLoader } = require('./igcLoader');
jest.mock('./gcsUploader');
jest.mock('./igcLoader');

describe('uploadIgc', () => {
    it('should upload IGC data to GCS', async () => {
        const date = '2023-10-10';
        const track = { pilotname: 'testPilot', liveTrackId: '12345' };
        const igcData = 'mockIgcData';
        
        const igcLoader = new IgcLoader(track.liveTrackId);
        igcLoader.getIgcData = jest.fn().mockReturnValue(igcData);
        
        await uploadIgc(date, track, igcLoader);
        
        expect(GcsUploader).toHaveBeenCalledWith('wefly-lake', '2023-10-10/igcs/testPilot_12345.igc');
        expect(GcsUploader.prototype.upload).toHaveBeenCalledWith(igcData);
    });
});

const axios = require('axios');
const { IgcLoader } = require('./igcLoader');
jest.mock('axios');

describe('IgcLoader', () => {
    it('should load IGC data successfully', async () => {
        const liveTrackId = '12345';
        const igcData = 'mockIgcData';
        const response = { status: 200, data: igcData };
        
        axios.get.mockResolvedValue(response);
        
        const igcLoader = new IgcLoader(liveTrackId);
        await igcLoader.load();
        
        expect(axios.get).toHaveBeenCalledWith(`https://www.livetrack24.com/leo_live.php?op=igc&trackID=${liveTrackId}`, {
            responseType: 'arraybuffer',
            httpAgent: expect.any(Object),
            httpsAgent: expect.any(Object),
            timeout: 10000,
        });
        expect(igcLoader.getIgcData()).toBe(igcData);
    });

    it('should throw an error if the request fails', async () => {
        const liveTrackId = '12345';
        axios.get.mockResolvedValue({ status: 404 });
        
        const igcLoader = new IgcLoader(liveTrackId);
        
        await expect(igcLoader.load()).rejects.toThrow(`Failed to get https://www.livetrack24.com/leo_live.php?op=igc&trackID=${liveTrackId}`);
    });
});

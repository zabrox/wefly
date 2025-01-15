const { uploadTrackPage } = require('./trackPageUploader');
const { GcsUploader } = require('./gcsUploader');
const { TrackPage } = require('./trackPage');
jest.mock('./gcsUploader');
jest.mock('./trackPage');

describe('uploadTrackPage', () => {
    it('should upload track page HTML to GCS', async () => {
        const date = '2023-10-10';
        const track = { pilotname: 'testPilot', liveTrackId: '12345' };
        const htmlData = '<html>mockHtmlData</html>';
        
        const trackPage = new TrackPage(track.liveTrackId);
        trackPage.getHtml = jest.fn().mockReturnValue(htmlData);
        
        await uploadTrackPage(date, track, trackPage);
        
        expect(GcsUploader).toHaveBeenCalledWith('wefly-lake', '2023-10-10/livetrack24/TrackPage-testPilot_12345.html');
        expect(GcsUploader.prototype.upload).toHaveBeenCalledWith(htmlData);
    });
});

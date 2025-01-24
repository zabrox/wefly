const { uploadTrackListPage } = require('./trackListPageUploader');
const { GcsUploader } = require('./gcsUploader');
const { TrackListPage } = require('./trackListPage');
jest.mock('./gcsUploader');
jest.mock('./trackListPage');

describe('uploadTrackListPage', () => {
    it('should upload TrackListPage HTML to GCS', async () => {
        const date = '2023-10-10';
        const pageNumber = 1;
        const html = '<html>mockHtml</html>';
        
        const trackListPage = new TrackListPage(date, pageNumber);
        trackListPage.getHtml = jest.fn().mockReturnValue(html);
        trackListPage.getPageNumber = jest.fn().mockReturnValue(pageNumber);
        
        await uploadTrackListPage(date, trackListPage);
        
        expect(GcsUploader).toHaveBeenCalledWith(expect.any(String), expect.any(String));
        expect(GcsUploader.prototype.upload).toHaveBeenCalledWith(html);
    });
});

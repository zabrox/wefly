import unittest.mock
import datetime
from bs4 import BeautifulSoup
import track
import export_tracks

class TestDownloadHtml(unittest.TestCase):
    def test_download(self):
        with unittest.mock.patch('requests.get') as mocked_get:
            mocked_get.return_value.ok = True
            mocked_get.return_value.text = 'Success'
            response = export_tracks.download_html('http://example.com')
            self.assertEqual(response, 'Success')

class TestParseTrackRow(unittest.TestCase):
    def test_parse_track_row(self):
        html = ""
        with open('tests/trackrow.html') as f:
            html = f.read()
        mock_track_row = BeautifulSoup(html, 'html.parser')
        track = export_tracks.parse_track_row(mock_track_row)
        self.assertEqual(track.pilotname, 'maitareshupe')
        self.assertEqual(track.location, 'Asagiri -DK Skygym - JP [~0.2 km]')
        self.assertEqual(track.altitude, '891 m')
        self.assertEqual(track.duration, '00:04:10')
        self.assertEqual(track.distance, '1.4 km')
        self.assertEqual(track.lasttime, datetime.datetime.strptime('2024-01-03 14:51:45', '%Y-%m-%d %H:%M:%S'))
        self.assertEqual(track.trackid, '2537581')
        self.assertEqual(track.activity, 'Paraglider')
        self.assertEqual(track.isLive, False)

    def test_parse_track_row_live(self):
        html = ""
        with open('tests/trackrow_live.html') as f:
            html = f.read()
        mock_track_row = BeautifulSoup(html, 'html.parser')
        track = export_tracks.parse_track_row(mock_track_row)
        self.assertEqual(track.pilotname, 'aschwehn')
        self.assertEqual(track.location, 'Sierra de Loja - ES [~0.4 km]')
        self.assertEqual(track.altitude, '1299 m')
        self.assertEqual(track.duration, '00:17:00')
        self.assertEqual(track.distance, '1.1 km')
        self.assertEqual(track.lasttime, datetime.datetime.strptime('2024-01-03 14:37:52', '%Y-%m-%d %H:%M:%S'))
        self.assertEqual(track.trackid, '2537642')
        self.assertEqual(track.activity, 'Glider')
        self.assertEqual(track.isLive, True)

class TestGetListTableElements(unittest.TestCase):

    @unittest.mock.patch('export_tracks.firestore.Client')
    @unittest.mock.patch('export_tracks.parse_track_row')
    def test_get_list_table_elements(self, mock_parse_track_row, mock_firestore_client):
        mock_html = '''
        <html>
            <table class="tracktable">
            </table>
        </html>
        '''

        # Set up mock responses
        dummytrack = track.Track()
        dummytrack.isLive = False
        dummytrack.filename = lambda: 'takase_20240103145145'
        mock_parse_track_row.return_value = dummytrack
        mock_doc_ref = unittest.mock.Mock()
        mock_doc_ref.get.return_value.exists = False
        mock_firestore_client.return_value.collection.return_value.document.return_value = mock_doc_ref

        # Call the function with mock HTML
        tracks, cont = export_tracks.get_list_table_elements(mock_html)

        # Assertions
        mock_parse_track_row.assert_called()
        mock_firestore_client.assert_called()
        self.assertIsInstance(tracks, list)
        self.assertEqual(len(tracks), 1)
        self.assertEqual(tracks[0].filename(), 'takase_20240103145145')
        self.assertEqual(cont, True)

    @unittest.mock.patch('export_tracks.firestore.Client')
    @unittest.mock.patch('export_tracks.parse_track_row')
    def test_get_list_table_elements_with_live(self, mock_parse_track_row, mock_firestore_client):
        mock_html = '''
        <html>
            <table class="tracktable">
            </table>
            <table class="tracktable">
            </table>
        </html>
        '''

        # Set up mock responses
        dummytrack1 = track.Track()
        dummytrack1.isLive = False
        dummytrack1.filename = lambda: 'takase_20240103145145'
        dummytrack2 = track.Track()
        dummytrack2.isLive = True
        dummytrack2.filename = lambda: 'takase_20240103165145'
        mock_parse_track_row.side_effect = [dummytrack1, dummytrack2]
        mock_doc_ref = unittest.mock.Mock()
        mock_doc_ref.get.return_value.exists = False
        mock_firestore_client.return_value.collection.return_value.document.return_value = mock_doc_ref

        # Call the function with mock HTML
        tracks, cont = export_tracks.get_list_table_elements(mock_html)

        # Assertions
        mock_parse_track_row.assert_called()
        mock_firestore_client.assert_called()
        self.assertIsInstance(tracks, list)
        self.assertEqual(len(tracks), 1)
        self.assertEqual(tracks[0].filename(), 'takase_20240103145145')
        self.assertEqual(cont, True)

    @unittest.mock.patch('export_tracks.firestore.Client')
    @unittest.mock.patch('export_tracks.parse_track_row')
    def test_get_list_table_elements_all_live(self, mock_parse_track_row, mock_firestore_client):
        mock_html = '''
        <html>
            <table class="tracktable">
            </table>
            <table class="tracktable">
            </table>
        </html>
        '''

        # Set up mock responses
        dummytrack1 = track.Track()
        dummytrack1.isLive = True
        dummytrack1.filename = lambda: 'takase_20240103145145'
        dummytrack2 = track.Track()
        dummytrack2.isLive = True
        dummytrack2.filename = lambda: 'takase_20240103165145'
        mock_parse_track_row.side_effect = [dummytrack1, dummytrack2]
        mock_doc_ref = unittest.mock.Mock()
        mock_doc_ref.get.return_value.exists = False
        mock_firestore_client.return_value.collection.return_value.document.return_value = mock_doc_ref

        # Call the function with mock HTML
        tracks, cont = export_tracks.get_list_table_elements(mock_html)

        # Assertions
        mock_parse_track_row.assert_called()
        self.assertIsInstance(tracks, list)
        self.assertEqual(len(tracks), 0)
        self.assertEqual(cont, True)

class TestDownloadIGC(unittest.TestCase):
    @unittest.mock.patch('export_tracks.requests.get')
    @unittest.mock.patch('builtins.open')
    def test_download_igc(self, mock_open, mock_requests_get):
        dummytrack = track.Track()
        dummytrack.trackid = '12345'
        dummytrack.filename = lambda: 'takase_20240103145145'
        mock_response = mock_requests_get.return_value
        mock_response.ok = True
        mock_response.content = b'IGC file content'

        export_tracks.download_igc(dummytrack, '2022-01-01')

        mock_requests_get.assert_called_once_with('https://www.livetrack24.com/leo_live.php?op=igc&trackID=12345')
        mock_open.assert_called_once_with('./tracks/2022-01-01/takase_20240103145145.igc', 'wb')

class TestExportTracks(unittest.TestCase):
    @unittest.mock.patch('export_tracks.download_html')
    @unittest.mock.patch('export_tracks.get_list_table_elements')
    @unittest.mock.patch('export_tracks.os.path.exists')
    @unittest.mock.patch('export_tracks.os.makedirs')
    @unittest.mock.patch('export_tracks.download_igc')
    def test_export_tracks(self, mock_download_igc, mock_makedirs, mock_path_exists, mock_get_list_table_elements, mock_download_html):
        # Setup the mocks
        mock_path_exists.return_value = False
        mock_get_list_table_elements.side_effect = [[['track1', 'track2'], True], [['track3', 'track4'], True], [[], False]]

        # Mock HTML content for each page
        mock_download_html.side_effect = ['html content page 1', 'html content page 2', '']

        # Call the function
        result = export_tracks.export_tracks('2023-01-01')

        # Assertions
        self.assertEqual(len(result), 4)
        mock_download_html.assert_has_calls([
            unittest.mock.call('https://www.livetrack24.com/tracks/country/jp/from/2023-01-01/to/2023-01-01/page_num/1'),
            unittest.mock.call('https://www.livetrack24.com/tracks/country/jp/from/2023-01-01/to/2023-01-01/page_num/2'),
            unittest.mock.call('https://www.livetrack24.com/tracks/country/jp/from/2023-01-01/to/2023-01-01/page_num/3')])
        mock_get_list_table_elements.assert_called()
        mock_path_exists.assert_called_once_with('./tracks/2023-01-01')
        mock_makedirs.assert_called_once_with('./tracks/2023-01-01')
        self.assertEqual(mock_download_igc.call_count, 4)

if __name__ == '__main__':
    unittest.main()
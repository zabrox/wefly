import unittest
import os
import datetime
from unittest.mock import patch, MagicMock
import convert_tracks
import track

class TestConvertTracks(unittest.TestCase):
    @patch('convert_tracks.load_areas')
    @patch('convert_tracks.igc_to_json')
    @patch('convert_tracks.find_nearest_area')
    @patch('convert_tracks.json.dump')
    @patch('convert_tracks.storage.Client')
    @patch('convert_tracks.firestore.Client')
    @patch('convert_tracks.upload_file_to_gcs')
    def test_convert_tracks(self, mock_upload_file_to_gcs, mock_firestore_client, mock_storage_client, mock_json_dump, mock_find_nearest_area, mock_igc_to_json, mock_load_areas):
        # Mock data
        date = '2023-01-01'
        tracks = [MagicMock(filename=lambda: 'track1'), MagicMock(filename=lambda: 'track2')]
        areas = ['area1', 'area2']
        dict_data = {'key': 'value'}
        area = 'nearest_area'

        # Mock return values and side effects
        mock_load_areas.return_value = areas
        mock_igc_to_json.side_effect = [dict_data, dict_data]
        mock_find_nearest_area.side_effect = [area, None]

        # Call the function
        convert_tracks.convert_tracks(date, tracks)

        # Assertions
        mock_load_areas.assert_called_once()
        self.assertEqual(mock_igc_to_json.call_count, 2)
        mock_find_nearest_area.assert_called()
        self.assertEqual(mock_json_dump.call_count, 1)
        mock_upload_file_to_gcs.assert_called()
        self.assertEqual(mock_firestore_client.call_count, 1)
        self.assertEqual(mock_storage_client.call_count, 1)

    def test_upload_file_to_gcs(self):
        # Mock data
        date = '2023-01-01'
        db = MagicMock()
        doc_ref = db.collection.return_value.document.return_value = MagicMock()
        metadata = {
            "pilotname": "takase",
            "location": "Asagiri",
            "duration": 120,
            "distance": 100,
            "trackid": 12345,
            "lasttime": datetime.datetime.strptime("2023-01-01 12:00:00", '%Y-%m-%d %H:%M:%S'),
            "activity": "Paraglider",
            "file_url": "https://example.com/takase_20230101120000.json"
        }
        t = track.Track()
        t.pilotname = metadata["pilotname"]
        t.location = metadata["location"]
        t.duration = metadata["duration"]
        t.distance = metadata["distance"]
        t.trackid = metadata["trackid"]
        t.lasttime = metadata["lasttime"]
        t.activity = metadata["activity"]
        blobmock = MagicMock()
        blobmock.public_url = metadata["file_url"]
        blobmock.upload_from_filename.return_value = None
        bucket = MagicMock()
        bucket.blob.return_value = blobmock

        convert_tracks.upload_file_to_gcs(date, bucket, db, t)

        # Mock function calls
        bucket.blob.assert_called_with('2023-01-01/takase_20230101120000.json')
        blobmock.upload_from_filename.assert_called_with('takase_20230101120000.json')
        db.collection.assert_called_with('tracks')
        db.collection().document.assert_called_with(t.filename())
        doc_ref.set.assert_called_with(metadata)

    def test_igc_to_json(self):
        # Mock data
        date = '2023-01-01'
        track = MagicMock()
        track.filename.return_value = 'ashida_20231001020207'
        track.pilotname = 'ashida'
        track.distance = 100
        track.duration = 120
        track.activity = 'Paraglider'

        with open('tests/ashida_20231001020207.igc', 'r') as f:
            file_content = f.read()

        open_mock = unittest.mock.mock_open(read_data=file_content)
        with unittest.mock.patch('builtins.open', open_mock):
            result = convert_tracks.igc_to_json(date, track)

            # Assertions
            self.assertEqual(result['pilotname'], 'ashida')
            self.assertEqual(result['distance'], 100)
            self.assertEqual(result['duration'], 120)
            self.assertEqual(result['activity'], 'Paraglider')
            self.assertEqual(len(result['track_points']), 3)
            self.assertEqual(result['track_points'][0], ['2023-01-01T02:01:25.000Z', 35.239857072, 134.97931082600002, 685])
            self.assertEqual(result['track_points'][1], ['2023-01-01T02:01:53.000Z', 35.239807074, 134.97937749, 681])
            self.assertEqual(result['track_points'][2], ['2023-01-01T02:02:07.000Z', 35.239823740000006, 134.979360824, 681])

if __name__ == '__main__':
    unittest.main()
    
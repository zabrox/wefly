import unittest
import datetime
from track import Track

class TestTrack(unittest.TestCase):

    def setUp(self):
        self.track = Track()

    def test_get_metadata(self):
        self.track.pilotname = "JohnDoe"
        self.track.location = "New York"
        self.track.altitude = 1000
        self.track.duration = 60
        self.track.distance = 10
        self.track.trackid = 12345
        self.track.lasttime = datetime.datetime.strptime("2022-01-01 12:00:00", '%Y-%m-%d %H:%M:%S')
        self.track.activity = "Paraglider"
        self.track.isLive = False

        metadata = self.track.get_metadata()

        self.assertEqual(metadata, {
            "pilotname": "JohnDoe",
            "location": "New York",
            "duration": 60,
            "distance": 10,
            "trackid": 12345,
            "lasttime": datetime.datetime.strptime("2022-01-01 12:00:00", '%Y-%m-%d %H:%M:%S'),
            "activity": "Paraglider",
        })

    def test_filename(self):
        self.track.pilotname = "JohnDoe"
        self.track.lasttime = datetime.datetime.strptime("2022-01-01 12:00:00", '%Y-%m-%d %H:%M:%S')

        filename = self.track.filename()

        self.assertEqual(filename, "JohnDoe_20220101120000")

if __name__ == '__main__':
    unittest.main()

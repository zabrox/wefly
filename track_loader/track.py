class Track:
    pilotname = ""
    location = ""
    altitude = 0
    duration = 0
    distance = 0
    trackid = 0
    lasttime = ""
    activity = ""
    isLive = False

    def get_metadata(self):
        return {
            'pilotname': self.pilotname,
            'location': self.location,
            'duration': self.duration,
            'distance': self.distance,
            'trackid': self.trackid,
            'lasttime': self.lasttime,
            'activity': self.activity,
        }

    def filename(self):
        return self.pilotname + "_" + self.lasttime.strftime("%Y%m%d%H%M%S")

    def __str__(self):
        return "pilotname: " + self.pilotname + " location: " + self.location + " id: " + str(self.trackid) + " lasttime: " + str(self.lasttime)

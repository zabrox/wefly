CREATE TABLE if not exists path (
  trackid TEXT NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  altitude FLOAT NOT NULL,
  time TIMESTAMP NOT NULL
);
CREATE INDEX path_trackid_index ON path (trackid);
CREATE INDEX path_time_index ON path (time);
CREATE INDEX path_longitude_index ON path (longitude);
CREATE INDEX path_latitude_index ON path (latitude);
CREATE INDEX path_altitude_index ON path (altitude);
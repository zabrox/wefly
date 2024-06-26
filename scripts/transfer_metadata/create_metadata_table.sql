CREATE TABLE wefly.metadatas (
  id string PRIMARY KEY NOT ENFORCED,
  pilotname string not null,
  distance float64 not null,
  duration int64 not null,
  maxAltitude int64 not null,
  startTime datetime not null,
  lastTime datetime not null,
  startLongitude float64 not null,
  startLatitude float64 not null,
  startAltitude int64 not null,
  lastLongitude float64 not null,
  lastLatitude float64 not null,
  lastAltitude int64 not null,
  activity string,
  model string,
  area string,
)
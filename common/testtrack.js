const dayjs = require('dayjs');
const { Metadata } = require('../common/metadata.js');

const metadata = new Metadata();
metadata.activity = "Paraglider";
metadata.pilotname = "John Doe";
metadata.distance = 100;
metadata.duration = 60;
metadata.maxAltitude = 1000;
metadata.startTime = dayjs('2024-02-14 11:34:56');
metadata.lastTime = dayjs('2024-02-14 12:34:56');
metadata.startPosition = [37.7749, -122.4194, 0];
metadata.lastPosition = [37.7750, -122.4193, 100];
metadata.area = "aaa";

console.log(metadata.serialize());
console.log(JSON.parse(JSON.stringify(metadata.serialize())));
const dayjs = require('dayjs');
const { Track } = require('./track.js');
const { Area } = require('./area.js');

test('getId returns the correct ID', () => {
    const metadata = {
        pilotname: 'John Doe',
        lastTime: dayjs('2022-01-01 12:34:56')
    };
    const track = new Track();
    track.metadata = metadata;

    const id = track.getId();

    expect(id).toBe('JohnDoe_20220101033456');
});

test('serialize and desrialize track', () => {
    const track = new Track();
    track.metadata.pilotname = 'John Doe';
    track.metadata.distance = 100;
    track.metadata.duration = 60;
    track.metadata.maxAltitude = 1000;
    track.metadata.startTime = dayjs('2024-02-14 11:34:56');
    track.metadata.lastTime = dayjs('2024-02-14 12:34:56');
    track.metadata.startPosition = [37.7749, -122.4194, 0];
    track.metadata.lastPosition = [37.7750, -122.4193, 100];
    track.metadata.activity = 'Paraglider';
    track.metadata.model = 'Kangri';
    track.metadata.area = new Area("Asagiri", 35.3, 138.9, 1000);

    track.path.addPoint(37.7749, -122.4194, 0, dayjs('2024-02-14 12:34:56'));
    track.path.addPoint(37.7750, -122.4193, 100, dayjs('2024-02-14 12:34:57'));

    const serialized = track.serialize();
    expect(serialized).toEqual({
        metadata: {
            pilotname: 'John Doe',
            startTime: '2024-02-14T02:34:56.000Z',
            lastTime: '2024-02-14T03:34:56.000Z',
            startPosition: [37.7749, -122.4194, 0],
            lastPosition: [37.7750, -122.4193, 100],
            activity: "Paraglider",
            distance: 100,
            duration: 60,
            maxAltitude: 1000,
            model: "Kangri",
            area: {areaName: "Asagiri", position: [35.3, 138.9, 1000]},
        },
        path: {
            points: [
                [37.7749, -122.4194, 0],
                [37.7750, -122.4193, 100],
            ],
            times: [
                '2024-02-14T03:34:56.000Z',
                '2024-02-14T03:34:57.000Z',
            ]
        }
    });

    const deserialized = Track.deserialize(serialized);
    expect(deserialized).toStrictEqual(track);
});
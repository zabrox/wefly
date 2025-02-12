import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export class Metadata {
    pilotname = "";
    distance = 0;    // in km
    duration = 0   // in minutes
    maxAltitude = 0;
    startTime = undefined;
    lastTime = undefined;
    startPosition = undefined;
    lastPosition = undefined;
    activity = "";
    model = "";
    area = "";
    maxGain = 0;
    dataSource = "";

    getId() {
        return (this.pilotname + '_' + this.startTime.utc().format('YYYYMMDDHHmmss')).replace(' ', '');
    }

    durationString() {
        const hours = Math.floor(this.duration / 60);
        const minutes = this.duration % 60;
        return hours + 'h ' + minutes + 'm';
    }

    static deserialize(dto) {
        const metadata = new Metadata();
        metadata.pilotname = dto.pilotname;
        metadata.distance = dto.distance;
        metadata.duration = dto.duration;
        metadata.maxAltitude = dto.maxAltitude;
        metadata.startTime = dayjs(dto.startTime);
        metadata.lastTime = dayjs(dto.lastTime);
        metadata.startPosition = dto.startPosition;
        metadata.lastPosition = dto.lastPosition;
        metadata.activity = dto.activity;
        metadata.model = dto.model;
        metadata.area = dto.area;
        metadata.maxGain = dto.maxGain;
        metadata.dataSource = dto.dataSource;
        return metadata;
    }
}
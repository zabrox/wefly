const Firestore = require('@google-cloud/firestore');
const { Timestamp } = require('@google-cloud/firestore/build/src/timestamp.js');
const dayjs = require('dayjs');
const { Metadata } = require('./common/metadata.js');

const collection = "metadatas";

class MetadataPerpetuator {
    #db;

    constructor(projectId) {
        this.#db = new Firestore({
            porjectId: projectId,
        });
    }

    async perpetuate(track) {
        const converted = this.#convertToFirestoreObject(track.metadata);
        await this.#db.collection(collection).doc(track.getId()).set(converted);
    }

    async fetch(date) {
        const collectionRef = await this.#db.collection('metadatas');
        const snapshot = await collectionRef.where('startTime', '>=', dayjs(date).startOf('D').toDate())
            .where('startTime', '<=', dayjs(date).endOf('D').toDate())
            .get();
        if (snapshot.empty) {
            return [];
        }
        const metadatas = [];
        snapshot.forEach(element => {
            metadatas.push(this.#convertFromFirestoreObject(element.data()));
        });
        return metadatas;
    }

    #convertToFirestoreObject(metadata) {
        const metadataCopy = JSON.parse(JSON.stringify(metadata));
        metadataCopy.lastTime = Timestamp.fromDate(metadata.lastTime.toDate());
        metadataCopy.startTime = Timestamp.fromDate(metadata.startTime.toDate());
        return metadataCopy;
    };

    #convertFromFirestoreObject(obj) {
        const metadata = Metadata.deserialize(obj);
        metadata.startTime = dayjs(obj.startTime.toDate());
        metadata.lastTime = dayjs(obj.lastTime.toDate());
        return metadata;
    }
}

module.exports = { MetadataPerpetuator };
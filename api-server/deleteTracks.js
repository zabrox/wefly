const dayjs = require('dayjs');
const Firestore = require('@google-cloud/firestore');
const { Client } = require('pg');

const db = new Firestore({
    porjectId: 'wefly-407313',
});
const collection = "tracks";

const PG_HOST = '34.146.14.77';
const PG_USER = 'postgres';
const PG_PASSWORD = 'Meltingp0t';
const PG_DB = 'wefly';
const getPgClient = () => {
    return new Client({
        host: PG_HOST,
        user: PG_USER,
        password: PG_PASSWORD,
        database: PG_DB,
        port: 5432,
    });
};

async function deleteFromPg(tracks) {
    const client = getPgClient();
    client.connect();

    // delete existing path data
    const deleteQuery = `DELETE FROM path WHERE trackid IN (${tracks.join(',')});`;
    try {
        await client.query(deleteQuery);
    } catch (error) {
        throw error;
    };
}

async function deleteFromFirestore(tracks) {
    for (const track of tracks) {
        await db.collection(collection).doc(track).delete();
    }
}

async function listTracks(date) {
    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();
    const query = db.collection(collection)
                    .where("startTime", ">=", startOfDay)
                    .where("startTime", "<=", endOfDay);

    const snapshot = await query.get();
    const tracks = [];
    snapshot.forEach(doc => {
        tracks.push(doc.id);
    });
    return tracks;
}

async function main() {
    const tracks = await listTracks(process.argv[2]);
    await deleteFromFirestore(tracks);
    await deleteFromPg(tracks);
}

main();
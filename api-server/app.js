const express = require('express')
const Firestore = require('@google-cloud/firestore')
const { Storage } = require('@google-cloud/storage')
const fs = require('fs');
const zlib = require('zlib')
const util = require('util');

const app = express()

const bucketName = 'wefly';

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// list tracks
app.get('/api/tracklist', (req, res) => {
  if (req.query.date === undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  // add CORS header for local development
  if (req.headers.origin !== undefined) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
  }
  const startOfDay = new Date(req.query.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(req.query.date)
  endOfDay.setHours(23, 59, 59, 999);

  const db = new Firestore()
  db.collection('tracks')
    .where('lasttime', '>=', startOfDay)
    .where('lasttime', '<=', endOfDay).get()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).send('No matching documents.');
        return;
      }
      const tracks = new Array();
      snapshot.forEach(doc => {
        tracks.push(doc.data().trackid);
      });
      res.send(tracks);
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).send('Internal Server Error');
    })
})

app.get('/api/tracks', async (req, res) => {
  if (req.query.date === undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  // add CORS header for local development
  if (req.headers.origin !== undefined) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
  }

  try {
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`${req.query.date}/japan.json.gz`);
    const fileContentsBuffer = (await file.download())[0];
    const gzipUncompress = util.promisify(zlib.unzip);
    const uncompressedBuffer = await gzipUncompress(fileContentsBuffer);

    res.send(uncompressedBuffer.toString('utf-8'));
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = app
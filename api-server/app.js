const express = require('express')
const { glob } = require('glob')
const Firestore = require('@google-cloud/firestore')
const { Storage } = require('@google-cloud/storage')
const zlib = require('zlib')
const Buffer = require('buffer').Buffer;

const app = express()
const port = 8080

const db = new Firestore({
  projectId: 'wefly-407313',
  keyFilename: './wefly-407313-855d6567493e.json',
})
const storage = new Storage();
const bucketName = 'wefly';

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// list tracks
app.get('/api/tracklist', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  if (req.query.date === undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  const startOfDay = new Date(req.query.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(req.query.date)
  endOfDay.setHours(23, 59, 59, 999);
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

const decompressGzip = (buffer) => {
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

app.get('/api/tracks', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  if (req.query.date === undefined) {
    res.status(400).send('Bad Request');
    return;
  }

  let file = undefined;
  try {
    const bucket = storage.bucket(bucketName);
    file = bucket.file(`${req.query.date}/japan.json.gz`);
  } catch (error) {
    console.error('ERROR:', error);
    res.status(404).send('Not Found');
    return;
  }

  const readStream = file.createReadStream();
  readStream.on('error', (error) => {
    console.error('ReadStream error:', error);
    res.status(500).send(`Error: ${error.message}`);
    return;
  });

  readStream.pipe(zlib.createGunzip())
    .on('data', (data) => {
      res.write(data);
    })
    .on('end', () => {
      res.end();
    })
    .on('error', (error) => {
      res.status(500).send(`Error: ${error.message}`);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
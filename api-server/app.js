const express = require('express')
const { glob } = require('glob')
const Firestore = require('@google-cloud/firestore')
const { Storage } = require('@google-cloud/storage')

const app = express()
const port = 3001

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
app.get('/api/tracks/:date', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  // parse date using dayjs
  const startOfDay = new Date(req.params.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(req.params.date)
  endOfDay.setHours(23, 59, 59, 999);
  db.collection('tracks')
    .where('lasttime', '>=', startOfDay)
    .where('lasttime', '<', endOfDay).get()
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

app.get('/api/track/:trackid', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  const promise = db.collection('tracks')
    .where('trackid', '==', req.params.trackid).get()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).send('No matching documents.');
        return;
      }
      const doc = snapshot.docs[0];
      const basename = doc.data().file_url.split('/').pop();
      storage.bucket(bucketName).file(basename).download()
        .then(contents => {
          contents = contents.toString();
          res.send(contents);
        })
        .catch(err => {
          console.error('ERROR:', err);
          res.status(500).send('Internal Server Error');
        });
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
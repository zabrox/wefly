const express = require('express')
const { glob } = require('glob')
const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// list tracks
app.get('/tracks', (req, res) => {
  glob(`tracks/*.igc`).then(files => {
    // add CORS header
    res.header("Access-Control-Allow-Origin", "*")
    res.send(files.map(file => {
      return file.replace("tracks/", "")
    }))
  })
})

app.get('/tracks/:track', (req, res) => {
  // add CORS header
  res.header("Access-Control-Allow-Origin", "*")
  res.sendFile(`${__dirname}/tracks/${req.params.track}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const { registerTracksEndpoint } = require("./trackserver.js");
const express = require("express");
const port = 8080;

const app = express();
app.use(express.json({ limit: '50mb' }));

registerTracksEndpoint(app)

app.listen(port, () => {
  console.log(`WeFly API server listening on port ${port}`)
})
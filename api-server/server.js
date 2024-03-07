const { registerTracksEndpoint } = require("./trackserver.js");
const { registerPlacenameEndpoint } = require("./placenameserver.js");
const bodyParser = require('body-parser');
const express = require("express");
const port = 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

registerTracksEndpoint(app)
registerPlacenameEndpoint(app)

app.listen(port, () => {
  console.log(`WeFly API server listening on port ${port}`)
})
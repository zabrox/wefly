const { registerTracksEndpoint } = require("./trackserver.js");
const { registerTrackGroupsEndpoint } = require("./trackgroupsserver.js");
const { registerPlacenameEndpoint } = require("./placenameserver.js");
const { registerPilotIconEndpoint } = require("./piloticonserver.js");
const express = require("express");
const port = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

registerTracksEndpoint(app)
registerTrackGroupsEndpoint(app)
registerPlacenameEndpoint(app)
registerPilotIconEndpoint(app)

app.listen(port, () => {
  console.log(`WeFly API server listening on port ${port}`)
})

module.exports = { app };
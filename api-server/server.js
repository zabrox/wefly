const { registerTracksEndpoint } = require("./trackserver.js");
const { registerPlacenameEndpoint } = require("./placenameserver.js");
const { registerPilotIconEndpoint } = require("./piloticonserver.js");
const { registerTakeoffLandingEndpoint } = require("./takeofflandingserver.js");
const { registerOrganizationEndpoint } = require("./organizationserver.js");

const express = require("express");
const port = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));

registerTracksEndpoint(app)
registerPlacenameEndpoint(app)
registerPilotIconEndpoint(app)
registerTakeoffLandingEndpoint(app)
registerOrganizationEndpoint(app)

app.listen(port, () => {
  console.log(`WeFly API server listening on port ${port}`)
})

module.exports = { app };
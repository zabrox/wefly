const app = require('./app')
const port = 8080

app.listen(port, () => {
  console.log(`WeFly API server listening on port ${port}`)
})
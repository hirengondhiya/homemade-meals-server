const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3010

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("homemade meals api!")
})

app.post("/", (req, res) => {
  res.send(req.body)
})

app.listen(port, () => console.log(`Homemade meals server listening on port ${port}`))
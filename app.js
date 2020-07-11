const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3010

const app = express()
app.use(cors())
app.get("/", (req, res) => {
  res.send("homemade meals api!")
})

app.listen(port, () => console.log(`Homemade meals server listening on port ${port}`))
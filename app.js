const express = require('express')
const app = express()
const port = process.env.PORT || 3010

app.get("/", (req, res) => {
  res.send("homemade meals api!")
})

app.listen(port, () => console.log(`Homemade meals server listening on port ${port}`))
require("./db/connect-db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const menuRoutes = require("./routes/menu-routes");

const port = process.env.PORT || 3010;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("homemade meals api!");
});
app.use("/menu", menuRoutes);

app.listen(port, () =>
  console.log(`Homemade meals server listening on port ${port}`)
);

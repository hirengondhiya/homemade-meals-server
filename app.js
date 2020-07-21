const { connectDb, disconnectDb } = require("./db/connect-db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const authRouter = require("./routes/auth_routes");
const mealRoutes = require("./routes/meal-routes");
const orderRoutes = require("./routes/order-routes");

const port = process.env.PORT || 3010;

const app = express();

// let app crash if db does not connect
connectDb().then(() => {
  // console.log('connected to db')
});

app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    // resave and saveUninitialized set to false for deprecation warnings
    secret: "homemademeals-api",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1800000,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("homemade meals api!");
});

app.use("/", authRouter);
app.use("/meals", mealRoutes);
app.use("/orders", orderRoutes);

// send 404 for rest of the end points
app.use("*", (req, res) => {
  res.sendStatus(404);
});
// close db connection on close
app.on("close", disconnectDb);
module.exports = app.listen(port);

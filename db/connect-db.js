const mongoose = require("mongoose");
const homemadeMealsDbUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/homemade-meals";

mongoose.connect(
  homemadeMealsDbUrl,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.error("Can not connect databse.");
      throw new Error(`Error connecting db at ${homemadeMealsDbUrl}`);
    }
    console.log(`Connected to db at ${homemadeMealsDbUrl}`);
  }
);

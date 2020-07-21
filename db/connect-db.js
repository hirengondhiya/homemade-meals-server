const mongoose = require("mongoose");
const homemadeMealsDbUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/homemade-meals";

const connectDb = async function () {
  try {
    return await mongoose.connect(homemadeMealsDbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (e) {
    console.log("Error connecting db.");
    throw e;
  }
};

const disconnectDb = function () {
  mongoose.disconnect(() => {
    // console.log('disconnected db.')
  });
};

module.exports = {
  connectDb,
  disconnectDb,
};

// mongoose.connect(
//   homemadeMealsDbUrl,
//   {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   },
//   (err) => {
//     if (err) {
//       console.error("Can not connect databse.");
//       throw new Error(`Error connecting db at ${homemadeMealsDbUrl}`);
//     }
//     console.log(`Connected to db at ${homemadeMealsDbUrl}`);
//   }
// );

const mongoose = require('mongoose');

// set up connection for test database
const testDbUrl = 'mongodb://localhost:27017/homemade-meals-test'

const connectTestDB = async function () {
  try {
  
    const connection = await mongoose.connect(testDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // userCreateIndex: true
    })
  } catch (e) {
    console.log('Error connecting db.')
    throw e
  }
};

const disconnectTestDb = function () {
  mongoose.disconnect(() => {console.log('disconnected test db')})
};

module.exports = {
  connectTestDB,
  disconnectTestDb
};
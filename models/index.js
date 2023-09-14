const mongoose = require('mongoose');

module.exports = {
  connectDB: async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/nodemailerPractice');
      console.log('Database Connected Successfully');
    } catch (err) {
      console.log(err, 'Some issue while connecting to Database');
    }
  },
};

// mongodb://localhost:27017/

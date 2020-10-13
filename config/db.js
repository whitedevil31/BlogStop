const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    console.log(`mongoose connected : ${connect.connection.host}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = connectDB;

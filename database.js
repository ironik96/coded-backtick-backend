require("dotenv").config();
const mongoose = require("mongoose");
require("./models/Board");
require("./models/BoardMember");
require("./models/Notification");
require("./models/Reward");
require("./models/Task");
require("./models/User");
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DATABASE_KEY, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;

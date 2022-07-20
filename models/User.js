const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    require,
  },
  password: {
    type: String,
    require,
  },
  image: {
    type: String,
    default:
      "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png",
  },
  walletId: String,
  bio: String,
  birthday: {
    type: Date,
  },
  backtick: Number,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
});

module.exports = mongoose.model("User", UserSchema);

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
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
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

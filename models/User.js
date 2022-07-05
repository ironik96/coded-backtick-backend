const mongoose = require('mongoose');

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
  image: String,
  walletId: String,
  bio: String,
  birthday: Date,
  backtick:Number,
  //Array for boards
  // borads:[{type: mongoose.Schema.Types.ObjectId, ref:"Board"}],
});

module.exports = mongoose.model('User', UserSchema);

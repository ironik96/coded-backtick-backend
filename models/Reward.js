const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  title: { type: String, required },
  price: { type: Number, default: 0 },
  qty: { type: Number, default: 1 },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  image: String,
});

module.exports = mongoose.model("Reward", RewardSchema);

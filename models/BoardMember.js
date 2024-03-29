const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const BoardMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  role: { type: String, enum: ["admin", "member"], required: true },
  points: { type: Number, default: 0 },
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
  rank: { type: Number, default: 0 },
});

BoardMemberSchema.methods.fetchForBoard = function () {
  const selectedUserFields = "fname lname image";
  return this.populate({
    path: "userId",
    select: selectedUserFields,
  });
};

module.exports = mongoose.model("BoardMember", BoardMemberSchema);

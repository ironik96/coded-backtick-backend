const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, default: () => new Date() },
  endDate: { type: Date, default: () => new Date() },
  boardMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "BoardMember" }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  slug: { type: String, slug: "title", unique: true },
});

BoardSchema.methods.forNewMember = function () {
  const selectedBoardMemberFields = "userId points role";
  const selectedBoardMemberUserFields = "fname";
  return this.populate({
    path: "boardMembers",
    select: selectedBoardMemberFields,
    match: { role: "member" },
    options: { sort: { points: -1 } },
    populate: { path: "userId", select: selectedBoardMemberUserFields },
  });
};

module.exports = mongoose.model("Board", BoardSchema);

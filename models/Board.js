const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const BoardSchema = new mongoose.Schema({
  title: { type: String, required },
  description: String,
  startDate: { type: Date, default: () => new Date() },
  endDate: { type: Date, default: () => new Date() },
  boardMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "BoardMember" }],
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}],
  rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  slug: { type: String, slug: "title", unique: true },
});

module.exports = mongoose.model("Board", BoardSchema);

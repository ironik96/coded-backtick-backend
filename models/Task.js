const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  list: {
    type: String,
    enum: ["icebox", "todo", "doing", "review", "done"],
    required: true,
    lowercase: true,
  },
  points: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "BoardMember" },
});

module.exports = mongoose.model("Task", TaskSchema);

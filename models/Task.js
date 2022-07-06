const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required },
  list: {
    type: String,
    enum: ["icebox", "todo", "doing", "review", "done"],
    required,
  },
  points: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "BoardMember" },
});

module.exports = mongoose.model("Task", TaskSchema);

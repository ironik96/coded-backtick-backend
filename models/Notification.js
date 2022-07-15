const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["basic", "invite"], required: true },
  seen: { type: Boolean, default: false },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Notification", NotificationSchema);

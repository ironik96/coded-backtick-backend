const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required },
  title: { type: String, required },
  type: { type: String, enum: ["basic", "invite"], required },
  seen: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", NotificationSchema);

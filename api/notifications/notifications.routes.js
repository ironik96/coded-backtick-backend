const express = require("express");
const router = express.Router();
const {
  getNotifications,
  getAllNotifications,
  createNotification,
  updateNotification,
} = require("./notifications.controllers");

router.get("/all", getAllNotifications);
router.get("/:userId", getNotifications);
router.post("/", createNotification);
router.put("/", updateNotification);

module.exports = router;

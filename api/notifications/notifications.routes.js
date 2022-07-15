const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
} = require("./notifications.controllers");

router.get("/:userId", getNotifications);
router.post("/", createNotification);

module.exports = router;

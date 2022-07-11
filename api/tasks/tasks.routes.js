const express = require("express");
const router = express.Router();

const { addTaskToBoard, updateTask } = require("./tasks.controllers");

router.post("/", addTaskToBoard);
router.put("/", updateTask);

module.exports = router;

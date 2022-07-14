const express = require("express");
const router = express.Router();

const {
  addTaskToBoard,
  updateTask,
  deleteTask,
  getTask,
} = require("./tasks.controllers");

router.post("/", addTaskToBoard);
router.put("/", updateTask);
router.delete("/:taskId", deleteTask);
router.get("/:taskId", getTask);

module.exports = router;

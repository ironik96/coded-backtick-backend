const express = require("express");
const router = express.Router();

const {
  addTaskToBoard,
  updateTask,
  deleteTask,
} = require("./tasks.controllers");

router.post("/", addTaskToBoard);
router.put("/", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;

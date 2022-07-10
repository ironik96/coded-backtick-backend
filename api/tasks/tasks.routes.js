const express = require("express");
const router = express.Router();

const { addTaskToBoard } = require("./tasks.controllers");

router.post("/", addTaskToBoard);

module.exports = router;

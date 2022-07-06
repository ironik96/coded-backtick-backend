const express = require("express");
const router = express.Router();

const { createBoard, getBoards } = require("./boards.controllers");

router.get("/", getBoards);
router.post("/", createBoard);

module.exports = router;

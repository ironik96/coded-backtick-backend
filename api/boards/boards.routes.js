const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} = require("./boards.controllers");

router.get("/", getBoards);
router.post("/", createBoard);
router.put("/", updateBoard);
router.delete("/:boardId", deleteBoard);

module.exports = router;

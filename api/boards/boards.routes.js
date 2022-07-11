const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
  getBoardById,
} = require("./boards.controllers");

router.get("/", getBoards);
router.post("/", createBoard);
router.put("/", updateBoard);
router.get("/:boardId", getBoardById);
router.delete("/:boardId", deleteBoard);

module.exports = router;

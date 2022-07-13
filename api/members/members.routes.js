const express = require("express");
const router = express.Router();

const {
  getMember,
  addMember,
  deleteMember,
  getuser,
} = require("./members.controllers");

router.get("/member/:memberId", getMember);
router.put("/:boardId/", addMember);
router.put("/user/:userId/", getuser);
router.delete("/:boardId/:memberId", deleteMember);
module.exports = router;

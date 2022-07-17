const express = require("express");
const router = express.Router();

const {
  getMember,
  addMember,
  deleteBoardMember,
  getuser,
  updateMember,
  getUserMemberId,
  deleteMember
} = require("./members.controllers");

router.get("/member/:memberId", getMember);
router.get("/getUserMemberId/:userId", getUserMemberId);
router.put("/:boardId/", addMember);
router.put("/user/:userId/", getuser);
router.put("/member/:memberId", updateMember);
router.delete("/:boardId/:memberId", deleteBoardMember);
router.delete("/:memberId", deleteMember);
module.exports = router;

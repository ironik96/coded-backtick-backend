const express = require("express");
const router = express.Router();

const {
  getMember,
  addMember,
  deleteBoardMember,
  getuser,
  updateMember,
  getUserMemberId,
  deleteMember,
} = require("./members.controllers");

router.get("/member/:memberId", getMember);
router.get("/getUserMemberId/:userId", getUserMemberId);
router.put("/add-member", addMember);
router.put("/user/:userId/", getuser);
router.put("/member/:memberId", updateMember);
router.delete("/:boardId/:memberId/:userId", deleteBoardMember);

module.exports = router;

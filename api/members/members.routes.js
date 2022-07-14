const express = require("express");
const router = express.Router();

const {
  getMember,
  addMember,
  deleteMember,
  getuser,
  updateMember,
} = require("./members.controllers");

router.get("/member/:memberId", getMember);
router.put("/:boardId/", addMember);
router.put("/user/:userId/", getuser);
router.put("/member/:memberId", updateMember);
router.delete("/:boardId/:memberId", deleteMember);

module.exports = router;

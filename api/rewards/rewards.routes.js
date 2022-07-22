const express = require("express");
const router = express.Router();
const { addReward, allRewards } = require("./rewards.controllers");

router.get("/all", allRewards);
router.post("/", addReward);

module.exports = router;

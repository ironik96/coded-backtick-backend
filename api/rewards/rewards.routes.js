const express = require("express");
const router = express.Router();
const { addReward } = require("./rewards.controllers");

router.post("/", addReward);

module.exports = router;

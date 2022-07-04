const express = require("express");
const passport = require("passport");
const router = express.Router();

const { register, signin, getUsers } = require("./users.controllers");

router.post("/register", register);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get("/users", getUsers);

module.exports = router;

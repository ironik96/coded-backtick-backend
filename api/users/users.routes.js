const express = require("express");
const passport = require("passport");
const router = express.Router();

const { register, signin, getUsers, getUser } = require("./users.controllers");

router.post("/register", register);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get("/users", getUsers);
router.get("/user/:userId", getUser);

module.exports = router;

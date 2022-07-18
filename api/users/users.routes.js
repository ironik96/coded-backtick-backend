const express = require("express");
const passport = require("passport");
const router = express.Router();

const { register, signin, getUsers, getUser,Userinfo,UpdateUser } = require("./users.controllers");

router.post("/register", register);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get("/users", getUsers);
router.get("/user/:userId", getUser);
router.get("/you/:userId", Userinfo);
router.post("/update/:userId", UpdateUser);
module.exports = router;

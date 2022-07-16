const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

exports.signin = async (req, res) => {
  try {
    const payload = {
      _id: req.user._id,
      email: req.user.email,
      expires: Date.now() + keys.JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(payload, keys.JWT_SECRET);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.register = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 5);
    req.body.password = hashPassword;
    const newUser = await User.create(req.body);
    const payload = {
      _id: newUser._id,
      email: newUser.email,
      expires: Date.now() + keys.JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(payload, keys.JWT_SECRET);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  const [user, userError] = await tryCatch(() => queryUserData(userId));
  if (userError) return next(userError);

  res.status(200).json(user);
};

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

async function queryUserData(id) {
  const selectedUserFields = "-password -email";
  const selectedBoardFields = "-tasks -rewards";
  const selectedBoardMemberFields = "userId points -_id";
  const selectedBoardMemberUserFields = "fname -_id";

  return User.findById(id)
    .populate({
      path: "boards",
      select: selectedBoardFields,
      populate: {
        path: "boardMembers",
        select: selectedBoardMemberFields,
        options: { limit: 3, sort: { points: -1 } },
        populate: { path: "userId", select: selectedBoardMemberUserFields },
      },
    })
    .select(selectedUserFields);
}

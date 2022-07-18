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
    var profile = {
      fname: req.body.fname,
      lname: req.body.lname,
      email :req.body.email,
      password: req.body.password,
      image: "",
      walletId: null,
      bio: "",
      birthday: "",
      backtick: 0
    };
    const newUser = await User.create(profile);
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
exports.Userinfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId, '-password');
    res.status(201).json(user);
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

exports.UpdateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {new: true}).select("-password")
    res.status(201).json(user); 
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  const [user, userError] = await tryCatch(() => queryUserData(userId));
  if (userError) return next(userError);
  // todo: query notifications and add it to the response
  // todo: flatten user object
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
  const selectedUserFields = "image backtick boards";
  const selectedBoardFields =
    "title description startDate endDate boardMembers createdBy  slug";
  const selectedBoardMemberFields = "userId points -_id";
  const selectedBoardMemberUserFields = "fname -_id";

  return User.findById(id)
    .populate({
      path: "boards",
      select: selectedBoardFields,
      populate: {
        path: "boardMembers",
        select: selectedBoardMemberFields,
        populate: { path: "userId", select: selectedBoardMemberUserFields },
      },
    })
    .select(selectedUserFields);
}

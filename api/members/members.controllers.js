const Member = require("../../models/BoardMember");
const Board = require("../../models/Board");
const User = require("../../models/User");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.getMembers = async (req, res, next) => {
  const { membersIds } = req.body;
  const selectedFields = "fname lname";
  const [members, error] = await tryCatch(() =>
    Member.find({ _id: { $in: membersIds } }).populate({
      path: "userId",
      select: selectedFields,
    })
  );
  if (error) return next(error);
  res.status(200).json(members);
};

exports.getuser = async (req, res, next) => {
  const { userId } = req.params;
  const [user, error] = await tryCatch(() => User.findById(userId));
  if (error) return next(error);
  res.status(OK).json(user);
};
exports.getMember = async (req, res, next) => {
  const { memberId } = req.params;
  const [member, error] = await tryCatch(() => Member.findById(memberId));
  if (error) return next(error);
  res.status(OK).json(member);
};
exports.addMember = async (req, res, next) => {
  const { boardId } = req.params;
const newMember = parseAddMemberRequest(req.body);
  const [createMember, error1] = await tryCatch(() => Member.create(newMember));
  if (error1) return next(error1);
  const [response, error] = await tryCatch(
    () =>
      Board.findByIdAndUpdate(boardId, {
        $push: { boardMembers: createMember._id },
      }),
    User.findByIdAndUpdate(req.body.userId, {
      $push: { boards: boardId },
    })
  );
  if (error) return next(error);
  res.status(CREATED).json(response);
};

exports.deleteMember = async (req, res, next) => {
  const { boardId } = req.params;
  const { memberId } = req.params;
  console.log(memberId, "//");
  const [response, error] = await tryCatch(() =>
    Promise.all([
      Member.findByIdAndDelete(memberId),
      Board.findOneAndUpdate(boardId, { $pull: { boardMembers: memberId } }),
    ])
  );
  if (error) return next(error);

  res.status(NO_CONTENT).end();
};

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

function parseAddMemberRequest(reqBody) {
  const {  boardId, userId } = reqBody;
  return { role: "member", boardId:boardId, userId: userId };
}
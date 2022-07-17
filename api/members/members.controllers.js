const Member = require("../../models/BoardMember");
const Board = require("../../models/Board");
const User = require("../../models/User");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.getuser = async (req, res, next) => {
  const { userId } = req.params;
  const [user, error] = await tryCatch(() => User.findById(userId));
  if (error) return next(error);
  res.status(OK).json(user);
};
exports.getUserMemberId = async (req, res, next) => {
  const { userId } = req.params;
  const [user, error] = await tryCatch(() => Member.find({ userId: userId }));
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
  const selectedUserFields = "fname lname";
  let [createMember, error1] = await tryCatch(() => Member.create(newMember));
  if (error1) return next(error1);
  const [response, error] = await tryCatch(() =>
    Promise.all([
      Board.findByIdAndUpdate(boardId, {
        $push: { boardMembers: createMember._id },
      }),
      User.findByIdAndUpdate(req.body.userId, {
        $push: { boards: boardId },
      }),
    ])
  );
  // createMember = await createMember.populate({
  //   path: "userId",
  //   select: selectedUserFields,
  // });

  if (error) return next(error);
  res.status(CREATED).json(createMember);
};
exports.updateMember = async (req, res, next) => {
  const { memberId } = req.params;
  const newMember = parseAddMemberRequest(req.body);
  const [updatedmember, error1] = await tryCatch(() =>
    Member.findByIdAndUpdate(memberId, req.body)
  );
  if (error1) return next(error1);

  res.status(OK).json(updatedmember);
};

exports.deleteBoardMember = async (req, res, next) => {
  const { boardId } = req.params;
  const { memberId } = req.params;
  console.log(memberId, "//");
  const [response, error] = await tryCatch(() =>
    Promise.all([
      Member.findByIdAndDelete(memberId),
      Board.findByIdAndUpdate(
        { _id: boardId },
        { $pull: { boardMembers: memberId } }
      ),
      User.findOneAndUpdate(
        { boards: boardId },
        { $pull: { boards: boardId } }
      ),
    ])
  );
  if (error) return next(error);

  res.status(NO_CONTENT).end();
};
exports.deleteMember = async (req, res, next) => {
  const { memberId } = req.params;
  const [response, error] = await tryCatch(() =>
    Promise.all([Member.findByIdAndDelete(memberId)])
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
  const { boardId, userId } = reqBody;
  return { role: "member", boardId: boardId, userId: userId };
}

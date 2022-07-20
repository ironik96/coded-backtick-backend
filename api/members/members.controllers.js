const Member = require("../../models/BoardMember");
const Board = require("../../models/Board");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

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
  const inviteNotification = parseAddMemberRequest(req.body);
  const member = {
    role: "member",
    userId: inviteNotification.userId,
    boardId: inviteNotification.boardId,
  };

  const [createMember, createMemberError] = await tryCatch(() =>
    Member.create(member)
  );
  if (createMemberError) return next(createMemberError);

  const [response, error] = await tryCatch(() =>
    Promise.all([
      Board.findByIdAndUpdate(
        inviteNotification.boardId,
        {
          $push: { boardMembers: createMember._id },
        },
        { returnDocument: "after" }
      ),
      User.findByIdAndUpdate(inviteNotification.userId, {
        $push: { boards: inviteNotification.boardId },
      }),
      Notification.findByIdAndUpdate(
        inviteNotification._id,
        inviteNotification,
        { returnDocument: "after" }
      ),
    ])
  );

  const selectedBoardMemberFields = "userId points -_id";
  const selectedBoardMemberUserFields = "fname -_id";
  await response[0].populate({
    path: "boardMembers",
    select: selectedBoardMemberFields,
    options: { limit: 3, sort: { points: -1 } },
    populate: { path: "userId", select: selectedBoardMemberUserFields },
  });

  if (error) return next(error);
  res.status(CREATED).json({ board: response[0], notification: response[2] });
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
  const { userId } = req.params;
  const [response, error] = await tryCatch(() =>
    Promise.all([
      Member.findByIdAndDelete(memberId),
      Board.findByIdAndUpdate(
        { _id: boardId },
        { $pull: { boardMembers: memberId } }
      ),
      User.findByIdAndUpdate(userId, { $pull: { boards: boardId } }),
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
  const { boardId, seen, senderId, title, type, userId, _id } = reqBody;
  return { boardId, seen, senderId, title, type, userId, _id };
}

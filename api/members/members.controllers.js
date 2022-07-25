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
  const { io } = req;
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
      ).then((board) => board.forNewMember()),
      User.findByIdAndUpdate(inviteNotification.userId, {
        $push: { boards: inviteNotification.boardId },
      }).select("-password"),
      Notification.findByIdAndUpdate(
        inviteNotification._id,
        inviteNotification,
        { returnDocument: "after" }
      ),
      createMember.fetchForBoard(),
    ])
  );
  if (error) return next(error);
  const [board, user, notification, memberForBoard] = response;

  io.emit("add-member", [board, user]);
  io.emit("board-add-member", memberForBoard);
  res.status(CREATED).json({ board, notification });
};
exports.updateMember = async (req, res, next) => {
  const { memberId } = req.params;
  const { io } = req;
  const [updatedMember, error] = await tryCatch(() =>
    Member.findByIdAndUpdate(memberId, req.body, {
      returnDocument: "after",
    }).then((member) => member.fetchForBoard())
  );
  if (error) return next(error);

  io.emit("board-task", { type: "done", updatedMember });
  res.status(OK).json(updatedMember);
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

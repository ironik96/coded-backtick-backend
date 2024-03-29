const User = require("../../models/User");
const Board = require("../../models/Board");
const BoardMember = require("../../models/BoardMember");
const Task = require("../../models/Task");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.getBoards = async (req, res, next) => {
  const [boards, error] = await tryCatch(() => Board.find());
  if (error) return next(error);
  res.status(OK).json(boards);
};

exports.getBoardById = async (req, res, next) => {
  const { boardId } = req.params;

  const selectedUserFields = "fname lname image";
  const [board, error] = await tryCatch(() =>
    Board.findById(boardId)
      .populate("tasks")
      .populate("rewards")
      .populate({
        path: "boardMembers",
        populate: {
          path: "userId",
          select: selectedUserFields,
        },
      })
  );
  if (error) return next(error);
  res.status(OK).json(board);
};

exports.createBoard = async (req, res, next) => {
  // create board
  const newBoard = parseAddBoardRequest(req.body);
  const [createdBoard, error] = await tryCatch(() => Board.create(newBoard));
  if (error) return next(error);
  // update user boards
  const [response, userError] = await tryCatch(() =>
    User.findByIdAndUpdate(newBoard.createdBy, {
      $push: { boards: createdBoard._id },
    })
  );
  if (userError) return next(userError);

  res.status(CREATED).json(createdBoard);
};

exports.updateBoard = async (req, res, next) => {
  const board = parseUpdateBoardRequest(req.body);
  const [updatedBoard, error] = await tryCatch(() =>
    Board.findByIdAndUpdate(board._id, board, { returnDocument: "after" })
  );
  if (error) return next(error);

  const selectedBoardMemberFields = "userId points -_id";
  const selectedBoardMemberUserFields = "fname -_id";
  await updatedBoard.populate({
    path: "boardMembers",
    select: selectedBoardMemberFields,
    options: { limit: 3, sort: { points: -1 } },
    populate: { path: "userId", select: selectedBoardMemberUserFields },
  });

  res.status(OK).json(updatedBoard);
};

exports.deleteBoard = async (req, res, next) => {
  const { boardId } = req.params;

  const [response, error] = await tryCatch(() =>
    Promise.all([
      Board.findByIdAndDelete(boardId),
      User.find({ boards: boardId }).updateMany({ $pull: { boards: boardId } }),
      BoardMember.deleteMany({ boardId }),
      Task.deleteMany({ boardId }),
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

function parseAddBoardRequest(reqBody) {
  const { title, description, startDate, endDate, userId } = reqBody;
  return { title, description, startDate, endDate, createdBy: userId };
}

function parseUpdateBoardRequest(reqBody) {
  const { title, description, startDate, endDate, _id ,boardStatus} = reqBody;
  return { title, description, startDate, endDate, _id ,boardStatus};
}

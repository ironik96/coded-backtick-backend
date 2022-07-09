const User = require("../../models/User");
const Board = require("../../models/Board");

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
  const [board, error] = await tryCatch(() =>
    Board.findById(boardId).populate("tasks").populate("boardMembers")
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

  res.status(OK).json(updatedBoard);
};

exports.deleteBoard = async (req, res, next) => {
  const { boardId } = req.params;

  const [response, error] = await tryCatch(() =>
    Promise.all([
      Board.findByIdAndDelete(boardId),
      User.findOneAndUpdate(
        { boards: boardId },
        { $pull: { boards: boardId } }
      ),
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
  const { title, description, startDate, endDate, _id } = reqBody;
  return { title, description, startDate, endDate, _id };
}

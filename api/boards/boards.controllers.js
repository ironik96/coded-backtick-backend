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

exports.createBoard = async (req, res, next) => {
  const { userId } = req.body;

  // create board
  const newBoard = { ...parseBodyToBoard(req.body), createdBy: userId };
  const [createdBoard, error] = await tryCatch(() => Board.create(newBoard));
  if (error) return next(error);

  // update user boards
  const [response, userError] = await tryCatch(() =>
    User.findByIdAndUpdate(userId, {
      $push: { boards: createdBoard._id },
    })
  );
  if (userError) return next(userError);

  res.status(CREATED).json(createdBoard);
};

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

function parseBodyToBoard(reqBody) {
  const { title, description, startDate, endDate } = reqBody;
  return { title, description, startDate, endDate };
}

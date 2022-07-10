const Task = require("../../models/Task");
const Board = require("../../models/Board");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.addTaskToBoard = async (req, res, next) => {
  const task = parseAddTaskRequest(req.body);

  const [newTask, taskError] = await tryCatch(() => Task.create(task));
  if (taskError) return next(taskError);

  const [response, error] = await tryCatch(() =>
    Board.findByIdAndUpdate(newTask.boardId, { $push: { tasks: newTask._id } })
  );
  if (error) return next(error);

  res.status(CREATED).json(newTask);
};

function parseAddTaskRequest(requestBody) {
  const { title, boardId, list, points } = requestBody;
  return { title, boardId, list, points };
}

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

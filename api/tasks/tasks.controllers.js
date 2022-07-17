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

exports.updateTask = async (req, res, next) => {
  const task = parseUpdateTaskRequest(req.body);

  const [updatedTask, error] = await tryCatch(() =>
    Task.findByIdAndUpdate(task._id, task, { returnDocument: "after" })
  );
  if (error) return next(error);

  res.status(OK).json(updatedTask);
};

exports.deleteTask = async (req, res, next) => {
  const { taskId } = req.params;

  const [response, error] = await tryCatch(() =>
    Promise.all([
      Task.findByIdAndDelete(taskId),
      Board.findOneAndUpdate({ tasks: taskId }, { $pull: { tasks: taskId } }),
    ])
  );
  if (error) return next(error);

  res.status(NO_CONTENT).end();
};

exports.getTask = async (req, res, next) => {
  const { taskId } = req.params;
  const [task, error] = await tryCatch(() => Task.findById(taskId));
  if (error) return next(error);
  res.status(OK).json(task);
};
function parseAddTaskRequest(requestBody) {
  const { title, boardId, list, points } = requestBody;
  return { title, boardId, list, points };
}
function parseUpdateTaskRequest(requestBody) {
  const { _id, title, boardId, list, points, assignedTo } = requestBody;
  return { _id, title, boardId, list, points , assignedTo};
}

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

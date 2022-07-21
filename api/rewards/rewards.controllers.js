const Reward = require("../../models/Reward");
const Board = require("../../models/Board");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.addReward = (req, res, next) => {};

function parseAddTaskRequest(requestBody) {
  const { title, boardId, list, points } = requestBody;
  return { title, boardId, list, points };
}
function parseUpdateTaskRequest(requestBody) {
  const { _id, title, boardId, list, points, assignedTo } = requestBody;
  return { _id, title, boardId, list, points, assignedTo };
}

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

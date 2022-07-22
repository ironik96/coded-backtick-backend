const Reward = require("../../models/Reward");
const Board = require("../../models/Board");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.allRewards = async (req, res, next) => {
  const [rewards, error] = await tryCatch(() => Reward.find());
  if (error) return next(error);

  res.status(OK).json(rewards);
};
exports.addReward = async (req, res, next) => {
  const reward = parseAddRewardRequest(req.body);
  const [newReward, rewardError] = await tryCatch(() => Reward.create(reward));
  if (rewardError) return next(rewardError);

  const [newBoard, boardError] = await tryCatch(() =>
    Board.findByIdAndUpdate(reward.boardId, {
      $push: { rewards: newReward._id },
    })
  );
  if (boardError) return next(boardError);

  res.status(CREATED).json(newReward);
};

function parseAddRewardRequest(requestBody) {
  const { title, cryptoAmount, price, qty, boardId, image } = requestBody;
  return { title, cryptoAmount, price, qty, boardId, image };
}
function parseUpdateRewardRequest(requestBody) {
  const { _id, title, cryptoAmount, price, qty, boardId, image } = requestBody;
  return { _id, title, cryptoAmount, price, qty, boardId, image };
}

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

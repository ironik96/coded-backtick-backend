const Notification = require("../../models/Notification");

// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.getNotifications = async (req, res, next) => {
  const { userId } = req.params;

  const [notifications, error] = await tryCatch(() =>
    Notification.find({ userId, seen: false })
  );
  if (error) next(error);

  res.status(OK).json(notifications);
};
exports.createNotification = async (req, res, next) => {
  const notificationRequest = parseAddNotificationsRequest(req.body);

  const [notification, error] = await tryCatch(() =>
    Notification.create(notificationRequest)
  );
  if (error) next(error);

  res.status(CREATED).json(notification);
};

function parseAddNotificationsRequest(requestBody) {
  const { userId, title, type, boardId, senderId } = requestBody;
  return { userId, title, type, boardId, senderId };
}

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

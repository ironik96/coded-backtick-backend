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
exports.getAllNotifications = async (req, res, next) => {
  const [notifications, error] = await tryCatch(() => Notification.find());
  if (error) next(error);

  res.status(OK).json(notifications);
};
exports.createNotification = async (req, res, next) => {
  const notificationRequest = parseNotificationsRequest(req.body);

  const [notification, error] = await tryCatch(() =>
    Notification.create(notificationRequest)
  );
  if (error) next(error);

  res.status(CREATED).json(notification);
};

exports.updateNotification = async (req, res, next) => {
  const notificationRequest = parseNotificationsRequest(req.body);

  const [notification, error] = await tryCatch(() =>
    Notification.findByIdAndUpdate(
      notificationRequest._id,
      notificationRequest,
      { returnDocument: "after" }
    )
  );
  if (error) next(error);

  res.status(OK).json(notification);
};

function parseNotificationsRequest(requestBody) {
  const { _id, userId, title, type, boardId, senderId, seen } = requestBody;
  return { _id, userId, title, type, boardId, senderId, seen };
}

async function tryCatch(promise) {
  try {
    const response = await promise();
    return [response, null];
  } catch (error) {
    return [null, error];
  }
}

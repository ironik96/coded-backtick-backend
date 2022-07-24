const express = require("express");
const app = express();
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const connectDB = require("./database");
const { Server } = require("socket.io");

//routes
const userRoutes = require("./api/users/users.routes");
const boardRoutes = require("./api/boards/boards.routes");
const boardMembersRoutes = require("./api/members/members.routes");
const taskRoutes = require("./api/tasks/tasks.routes");
const notificationRoutes = require("./api/notifications/notifications.routes");
const rewardRoutes = require("./api/rewards/rewards.routes");

connectDB();
//Backend on Localhost:8000
const server = app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(
  morgan(
    "[:date[clf]] :method :url :status :response-time ms - :res[content-length]"
  )
);
passport.use(localStrategy);
passport.use(jwtStrategy);
const upload = require("./multer");
//User Route
app.use(userRoutes);
app.use("/boards", boardRoutes);
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use("/boardMembers", boardMembersRoutes);
app.use("/tasks", taskRoutes);
app.use("/notifications", notificationRoutes);
app.use("/rewards", rewardRoutes);

app.post("/profile", upload.single("avatar"), function (req, res, next) {
  // req.file is the `avatar` file
  // console.log(req.file.originalname)
  // req.body will hold the text fields, if there were any
  res.send(req.file.originalname);
});
// app.get('/',function(req,res) {
//   res.sendFile(__dirname + '/index.html')
// });
//no path
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//error handling middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

io.on("connection", (socket) => {
  console.log("new user connected");
  socket.emit("message", "welcome to my server 😈");
});

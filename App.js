const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const connectDB = require("./database");

//routes
const userRoutes = require("./api/users/users.routes");
const boardRoutes = require("./api/boards/boards.routes");
const boardMembersRoutes = require("./api/members/members.routes");
const taskRoutes = require("./api/tasks/tasks.routes");

connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

//User Route
app.use(userRoutes);
app.use("/boards", boardRoutes);
app.use("/boardMembers", boardMembersRoutes);
app.use("/tasks", taskRoutes);

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

//Backend on Localhost:8000
app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});

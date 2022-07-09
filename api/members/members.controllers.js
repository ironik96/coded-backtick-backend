const Member = require("../../models/BoardMember");
const Board = require("../../models/Board");
const User = require("../../models/User");


// status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;

exports.getMembers = async (req, res, next) => {
    const { boardId } = req.params;
  const [members, error] = await tryCatch(() => Board.findById(boardId));
  if (error) return next(error);
  res.status(OK).json(members.boardMembers);
};

exports.getuser = async (req, res, next) => {
  const { userId } = req.params;
const [user, error] = await tryCatch(() =>   User.findById(userId));
if (error) return next(error);
res.status(OK).json(user);
};
exports.getMember = async (req, res, next) => {
  const { memberId } = req.params;
const [member, error] = await tryCatch(() =>  Member.findById(memberId));
if (error) return next(error);
res.status(OK).json(member);
};
exports.addMember = async (req, res, next) => {
    const { boardId } = req.params;
   
    const [createMember, error1] = await tryCatch(() => Member.create(req.body));
    if (error1) return next(error1);
    const [response, error] = await tryCatch(() => 
    Board.findByIdAndUpdate(boardId, {
      $push: { boardMembers: createMember._id },
    }),
    User.findByIdAndUpdate(req.body.userId, {
      $push: { boards:boardId },
    })

  );
  if (error) return next(error);
  res.status(CREATED).json(response);
}

exports.deleteMember = async (req, res, next) => {
  const { boardId } = req.params;
  const { memberId } = req.params;
  console.log(memberId,"//")
  const [response, error] = await tryCatch(() =>
    Promise.all([
      Member.findByIdAndDelete(memberId)
      ,
      Board.findOneAndUpdate(
         boardId,
        { $pull: { boardMembers: memberId } }
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


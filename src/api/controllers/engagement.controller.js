const httpStatus = require("http-status");
const { shuffle } = require("lodash");
const User = require("../models/user.model");
const EngagementActivity = require("../models/engagementActivity.model");
const GuessWhoResponse = require("../models/guessWhoResponse.model");

const EnggTypeMap = {
  "guesswho": "Guess Who",
  "online": "Online Game",
  "riddle": "Riddle",
  "mcq": "Multiple Choice Questions"
}

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const engagement = await EngagementActivity.get(id);
    req.locals = { engagement };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.engagement);

// /**
//  * Get logged in user info
//  * @public
//  */
// exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const engagement = new EngagementActivity(req.body);

    const users = await User.list(req.query);
    let transformedUsers = users.map((user) => user.transform());
    transformedUsers = transformedUsers.filter((user) => user.role === "user");

    const QuestionAnswers = []; // new Set();

    transformedUsers.forEach((user) => {
      //   console.log("user1 : ",shuffle(transformedUsers));
      const tr1 = shuffle(transformedUsers)
        .filter((cu) => cu.id !== user.id)
        .slice(0, 2);
      const question = {
        questionImage:
          user.picture || "https://picsum.photos/seed/picsum/200/300",
        questionName: engagement.name,
        questionOptions: [tr1[0].name, user.name, tr1[1].name],
        answerPersonName: user.name,
        answerPersonId: user.id,
      };

      QuestionAnswers.push(question);
    });
    //   const r1 = Math.random() * transformedUsers.length;
    //   const person1 = [...transformedUsers].splice(r1, 1)[0];

    //   const r2 = Math.random() * transformedUsers.length;
    //   const person2 = [...transformedUsers].splice(r2, 1)[0];

    //   let remainingTwoPersonNames = transformedUsers.filter(
    //     (user) => user.id !== person1.id && user.id !== person2.id,
    //   );
    //   remainingTwoPersonNames = remainingTwoPersonNames.map(
    //     (user) => user.name,
    //   ).slice(2);

    //   console.log("users1 : ",shuffle(transformedUsers));

    //   const questions = [
    //     {
    //       questionImage: person2.picture || 'https://picsum.photos/seed/picsum/200/300',
    //       questionName: person2.name,
    //       questionOptions: [
    //         ...remainingTwoPersonNames,
    //         person1.name,
    //         person2.name,
    //       ],
    //       answerPersonName: person2.name,
    //       answerPersonImage: person2.picture || 'https://picsum.photos/seed/picsum/200/300',
    //     },
    //     {
    //       questionImage: person1.picture || 'https://picsum.photos/seed/picsum/200/300',
    //       questionName: person1.name,
    //       questionOptions: [
    //         ...remainingTwoPersonNames,
    //         person1.name,
    //         person2.name,
    //       ],
    //       answerPersonName: person1.name,
    //       answerPersonImage: person1.picture || 'https://picsum.photos/seed/picsum/200/300',
    //     },
    //   ];

    //   set.push(...questions);
    //   console.log(`from: ${person1.name} to: ${person2.name}`);
    // }

    // for (let [key, value] of set.entries())
    // {
    //     console.log(`from: ${key.from}: ${value.name} to:`);
    // }

    engagement.questionanswers = QuestionAnswers;
    // await currentEngagement.save();

    const savedEngagement = await engagement.save();
    res.status(httpStatus.CREATED);
    res.json(savedEngagement);
  } catch (error) {
    console.log(error);
    // next(EngagementActivity.checkDuplicateEmail(error));
  }
};

// /**
//  * Replace existing user
//  * @public
//  */
// exports.replace = async (req, res, next) => {
//   try {
//     const { user } = req.locals;
//     const newUser = new User(req.body);
//     const ommitRole = user.role !== 'admin' ? 'role' : '';
//     const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

//     await user.updateOne(newUserObject, { override: true, upsert: true });
//     const savedUser = await User.findById(user._id);

//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };

// /**
//  * Update existing user
//  * @public
//  */
// exports.update = (req, res, next) => {
//   const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
//   const updatedUser = omit(req.body, ommitRole);
//   const user = Object.assign(req.locals.user, updatedUser);

//   user.save()
//     .then((savedUser) => res.json(savedUser.transform()))
//     .catch((e) => next(User.checkDuplicateEmail(e)));
// };

// /**
//  * Update existing user
//  * @public
//  */
// exports.updateProfile = (req, res, next) => {
//   // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
//   // const updatedUser = omit(req.body, ommitRole);
//   const user = Object.assign(req.locals.user, req.body);

//   user.save()
//     .then((savedUser) => res.json(savedUser.transform()))
//     .catch((e) => next(User.checkDuplicateEmail(e)));
// };
/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const engagements = await EngagementActivity.list();
    res.json(engagements);
  } catch (error) {
    next(error);
  }
};

// /**
//  * Delete user
//  * @public
//  */
// exports.remove = (req, res, next) => {
//   const { user } = req.locals;

//   user.remove()
//     .then(() => res.status(httpStatus.NO_CONTENT).end())
//     .catch((e) => next(e));
// };

/**
 * Guess WHo
 * @public
 */
exports.guesswho = async (req, res, next) => {
  try {
    const currentEngagement = req.locals.engagement;
    const questionanswers = currentEngagement.questionanswers.filter(
      (qa) => qa.answerPersonName !== req.user.name
    );
    res.status(httpStatus.OK);
    res.json(questionanswers);
  } catch (error) {
    // console.log('engusers1 error : ', error);
    next(error);
  }
};

exports.todaysengagement = async (req, res, next) => {
  const engagements = await EngagementActivity.list({
    date: new Date().toDateString(),
  });
  const allquestionanswers = await Promise.all(
    engagements.map(async (engagement) => {
      const questionanswers = engagement.questionanswers.filter(
        (qa) => qa.answerPersonName !== req.user.name
      );

      // const qaresp = [];
      // for(const qa of questionanswers) {
      //     GuessWhoResponse.find({engagementActivityId: engagement.id, guessWhoUserId: qa.answerPersonId}).exec().then(resp => {
      //       console.log("test", resp);
      //       qaresp.push({
      //         ...questionanswers[i],
      //         response: resp.length > 0  ? resp[0].response : ""
      //       })
      //     });
      // }

      //const arr = [1, 2, 3];
      const qaresp = await Promise.all(
        questionanswers.map(async (qa) => {
          const resp = await GuessWhoResponse.find({
            engagementActivityId: engagement.id,
            guessWhoUserId: qa.answerPersonId,
          }).exec();
          return {
            ...qa,
            response: resp.length > 0 ? resp[0].response : "",
          };
        })
      );
      return {
        _id: engagement._id,
        questionanswers: qaresp,
      };
    })
  );
  res.json(allquestionanswers);
};

exports.saveResponse = async (req, res, next) => {
  try {
    const userGuess = new GuessWhoResponse(req.body);
    const engagement = await EngagementActivity.get(userGuess.engagementActivityId);
    const qa = engagement.questionanswers.find(cqa => cqa.answerPersonId === userGuess.guessWhoUserId)
    if(qa){
      if(qa.answerPersonName === userGuess.response){
        userGuess.guess = true;
        userGuess.score = 20;
      }
      else{
        userGuess.guess = false;
        userGuess.score = 10;
      }
    }

    userGuess.engagementActivityName = engagement.name;
    userGuess.engagementActivityDescription = engagement.description;
    userGuess.engagementActivityType = engagement.type;
    const savedUserGuess = await userGuess.save();
    res.status(httpStatus.OK);
    res.json(savedUserGuess);
  } catch (error) {
    next(error);
  }
};

exports.getScoreAndRecentActivities = async (req, res, next) => {
  try {
    const score = await GuessWhoResponse.aggregate([
      {
        $match: {
          "userId": req.user.id
        }
      },
      {
        $group: {
          _id: null,
          sum: { $sum: "$score" }
        }
      }
    ]);

    const recentEngagements = await GuessWhoResponse.find({userId : req.user.id}).sort({date: -1}).limit(3);

    res.status(httpStatus.OK);
    res.json({"score": score[0].sum, "recentEngagements": recentEngagements});
  } catch (error) {
    next(error)
  }
}

exports.getScoreAndAllActivities = async (req, res, next) => {
  try {
    const score = await GuessWhoResponse.aggregate([
      {
        $match: {
          "userId": req.user.id
        }
      },
      {
        $group: {
          _id: null,
          sum: { $sum: "$score" }
        }
      }
    ]);

    const recentEngagements = await GuessWhoResponse.find({userId : req.user.id}).sort({date: -1});

    res.status(httpStatus.OK);
    res.json({"score": score[0].sum, "recentEngagements": recentEngagements});
  } catch (error) {
    next(error)
  }
}

exports.dashboardDetails = async (req, res, next) => {
  try {
    const engagements = await EngagementActivity.list();
    const totalUsers = await User.list(req.query);

    const details = await Promise.all(engagements.map(async engg => {

    const participatedUsers = await GuessWhoResponse.find({engagementActivityId: engg._id.toString()});

    const participation = Math.floor(((participatedUsers.length)/ totalUsers.length) * 100)

      return {
        name: engg.name,
        category: EnggTypeMap[engg.type],
        date: engg.date,
        numofUsers: totalUsers.length,
        numOfParticipants: participatedUsers.length,
        participation: participation 
      }
    }));

    res.status(httpStatus.OK);
    res.json(details)
  } catch (error) {
    next(error)
  }
}
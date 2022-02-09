const httpStatus = require('http-status');
// const { omit } = require('lodash');
const User = require('../models/user.model');
const EngagementActivity = require('../models/engagementActivity.model');

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
    transformedUsers = transformedUsers.filter(
      (user) => user.id !== req.user._id.toString() && user.role === 'user',
    );

    const set = []; // new Set();

    while (transformedUsers.length >= 2) {
      const r1 = Math.random() * transformedUsers.length;
      const person1 = transformedUsers.splice(r1, 1)[0];

      const r2 = Math.random() * transformedUsers.length;
      const person2 = transformedUsers.splice(r2, 1)[0];

      let remainingTwoPersonNames = transformedUsers.filter(
        (user) => user.id !== person1.id && user.id !== person2.id,
      );
      remainingTwoPersonNames = remainingTwoPersonNames.map(
        (user) => user.name,
      ).slice(2);

      console.log(remainingTwoPersonNames);

      const questions = [
        {
          questionImage: person2.picture || 'https://picsum.photos/seed/picsum/200/300',
          questionName: person2.name,
          questionOptions: [
            ...remainingTwoPersonNames,
            person1.name,
            person2.name,
          ],
          answerPersonName: person2.name,
          answerPersonImage: person2.picture || 'https://picsum.photos/seed/picsum/200/300',
        },
        {
          questionImage: person1.picture || 'https://picsum.photos/seed/picsum/200/300',
          questionName: person1.name,
          questionOptions: [
            ...remainingTwoPersonNames,
            person1.name,
            person2.name,
          ],
          answerPersonName: person1.name,
          answerPersonImage: person1.picture || 'https://picsum.photos/seed/picsum/200/300',
        },
      ];

      set.push(...questions);
      //   console.log(`from: ${person1.name} to: ${person2.name}`);
    }

    // for (let [key, value] of set.entries())
    // {
    //     console.log(`from: ${key.from}: ${value.name} to:`);
    // }

    engagement.questionanswers = set;
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
// /**
//  * Get user list
//  * @public
//  */
// exports.list = async (req, res, next) => {
//   try {
//     const users = await User.list(req.query);
//     const transformedUsers = users.map((user) => user.transform());
//     res.json(transformedUsers);
//   } catch (error) {
//     next(error);
//   }
// };

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
      (qa) => qa.answerPersonName !== req.user.name,
    );
    res.status(httpStatus.OK);
    res.json(questionanswers);
  } catch (error) {
    // console.log('engusers1 error : ', error);
    next(error);
  }
};

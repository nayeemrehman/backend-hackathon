const mongoose = require("mongoose");
const httpStatus = require("http-status");
// const crypto = require('crypto');
// const moment = require('moment-timezone');
const APIError = require("../errors/api-error");

/**
 * Engagement Types
 */

/**
 * Engagement Activity Schema
 * @private
 */
const guessWhoResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  engagementActivityId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  guessWhoUserId: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  date: {
    type: String,
    default: new Date().toDateString(),
  },
  time: {
    type: String,
    default: new Date().toTimeString(),
  },
  guess: {
    type: Boolean,
  },
});

guessWhoResponseSchema.statics = {
  // async update(id) {
  //   let engagement;
  //   if (mongoose.Types.ObjectId.isValid(id)) {
  //     engagement = await this.findById(id).exec();
  //   }
  //   if (engagement) {
  //     return engagement;
  //   }
  //   throw new APIError({
  //     message: 'Engagement does not exist',
  //     status: httpStatus.NOT_FOUND,
  //   });
  // }
};

/**
 * @typedef GuessWhoResponse
 */
const GuessWhoResponse = mongoose.model(
  "GuessWhoResponse",
  guessWhoResponseSchema
);
module.exports = GuessWhoResponse;

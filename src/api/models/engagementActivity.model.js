const mongoose = require('mongoose');
const httpStatus = require('http-status');
// const crypto = require('crypto');
// const moment = require('moment-timezone');
const APIError = require('../errors/api-error');

/**
* Engagement Types
*/
const engagementTypes = ['online', 'riddle', 'guesswho', 'mcq'];

/**
 * Engagement Activity Schema
 * @private
 */
const engagementActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: engagementTypes,
    default: 'guesswho',
  },
  description: {
    type: String,
    required: true,
  },
});

engagementActivitySchema.statics = {
  engagementTypes,
  async get(id) {
    let engagement;

    if (mongoose.Types.ObjectId.isValid(id)) {
      engagement = await this.findById(id).exec();
    }
    if (engagement) {
      return engagement;
    }

    throw new APIError({
      message: 'Engagement does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
};

/**
 * @typedef EngagementActivity
 */
const EngagementActivity = mongoose.model('EngagementActivity', engagementActivitySchema);
module.exports = EngagementActivity;

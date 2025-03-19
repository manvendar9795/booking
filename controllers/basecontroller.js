// const dotenv = require('dotenv');
// dotenv.config();
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');

// const algorithm = 'aes-256-cbc';
// const secretKey = '7d47140fec7526478db9fb79322fcc689bbc0215159c78a59df2141aabf1f439';
const models = require("../models");
const UserModel = models.User;

module.exports = {
  // Default Response
  customInfo(data = null, message = "", success = true) {
    return {
      success,
      data,
      message,
    };
  },
  saved(data = null, message = "Record Saved", success = true) {
    return {
      success,
      data,
      message,
    };
  },
  fetched(data = null, message = "Data Fetched", success = true) {
    if (data.length == 0) {
      data = null;
    }
    return {
      success,
      data,
      message,
    };
  },
  deleted(data = null, message = "Data Deleted", success = true) {
    return {
      success,
      data,
      message,
    };
  },
  sendError(data = null, message = "", success = false) {
    return {
      success,
      data,
      message,
    };
  },

async check_unique_email(email, user_id) {
    const user = await UserModel.findOne({ where: { email } });
  
    // If no user is found, the email is unique
    if (!user) {
      return { result: true };
    }
  
    // If the found user's ID matches the given user_id, it's the same user (valid)
    if (user.id === user_id) {
      return { result: true };
    }
  
    // Otherwise, the email is already taken by another user
    return { result: false };
  },

};

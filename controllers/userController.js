"use strict";
const resp = require("./basecontroller");
const validation = require("./validationController");
const models = require("../models");
const UserModel = models.User;
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    var validationRule = {
      firstName: "required|string",
      lastName: "required|string",
      email: "required|string|email",
      // "password": "required|string|min:8",
      user_type: "required|in:doctor,patient",
    };
    await validation(req.body, validationRule, null, async (err, status) => {
      if (!status) {
        res.status(400).json(resp.sendError(err.errors, "Validation failed"));
      } 
      // Check if email is unique
      const isUnique = await resp.check_unique_email(req.body.email);
      if (!isUnique.result) {
        return res.status(400).json(resp.sendError(null, "Email already exists"));
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

        let userData = await UserModel.create(req.body);
        if (!userData) {
          return res.status(400).json(resp.sendError(null, "user not create"));
        }
        return res.status(200).json(resp.customInfo(userData, "create successfully"));
      
    }).catch((err) => {
      console.log(err);
      res.status(400).json(resp.sendError(null, err.message));
    });
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};




exports.getAllUser = async (req, res) => {
  try {
    let userList = await UserModel.findAll({ where: { is_delete: "false" } });

    if (userList.length <= 0) {
      return res.status(200).json(resp.customInfo(null, "User not found"));
    }
    return res.status(200).json(resp.customInfo(userList, "User list fetch successfully"));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await UserModel.findOne({
      where: { id: userId, is_delete: "false" },
    });
    if (!user) {
      return res.status(200).json(resp.customInfo(null, "User not found"));
    }

    return res.status(200).json(resp.fetched(user));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let userData = await UserModel.findOne({
      where: { id: userId, is_delete: "false" },
    });
    if (!userData) {
      return res.status(200).json(resp.customInfo(null, "User not found"));
    }
    let update = userData.update({ is_delete: "true", deletedAt: new Date()});
    if (!update) {
      return res.status(200).json(resp.customInfo(null, "User not updated"));
    }

    return res
      .status(200)
      .json(resp.customInfo(userData, "User Delete successfully"));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // const updateData = req.body; // Data to update
    // // Find user that is not deleted
    let user = await UserModel.findOne({
      where: { id: userId, is_delete: "false" },
    });
    if (!user) {
      return res.status(400).json(resp.customInfo(null, "User not found"));
    }

    let updateUser = await user.update(req.body);
    if (!updateUser) {
      return res.status(400).json(resp.customInfo(null, "User not updated"));
    }

    return res.status(200).json(resp.customInfo(updateUser, "User updated successfully"));
  } catch (error) {
    return res.status(400).json(resp.sendError(null, error.message));
  }
};
     
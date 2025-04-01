const validation = require("./validationController");
const resp = require('./basecontroller');
const Model = require('../models');
const UserModel = Model.User;
const bcript = require('bcrypt');
const JWT = require('jsonwebtoken')
const { where } = require("sequelize");

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
      // check if email is unique 
      const isUnique = await resp.check_unique_email(req.body.email);
      if(!isUnique.result){
        res.status(400).json(resp.customInfo(null, " email is not unique"));
      }

      // Check if mobile is unique
      const isMobileUnique = await resp.check_unique_mobile(req.body.mobile);
      if (!isMobileUnique.result) {
        return res.status(400).json(resp.sendError(null, "Mobile Number  already exists"));
      }

      const hashedPassword = await bcript.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      let userData = await UserModel.create(req.body);
      if(!userData){
        return res.status(400).json(resp.customInfo(null, " User not Create"))
      }
      return res.status(200).json(resp.customInfo(userData, " Create User Successfully"))
    });
  } catch (error) {
    return res.status(500).send(resp.sendError("somthing went wrong", error.message));
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      res.status(400).json(resp.customInfo(null, "Plesase provide email and password"))
    }
  
    const user = await UserModel.findOne({where:{email: email}});
    if(!user){
      res.status(400).json(resp.customInfo(null, " wrong email "));
    }
    // Password Match
    const isMatch = await bcript.compare(password, user.password );
    if(!isMatch){
      res.status(400).json(resp.customInfo(null, " Wrong password"))
    }
  
    // Generate token
    const token = await JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store token in database
    await user.update({ access_token: token });

    // for hidding password -->
    user.password = undefined;
    
    return res.status(200).send(resp.customInfo({ user, token }, "Login success fully "));
  } catch (error) {
    return res.status(500).send(resp.sendError("somthing went wrong", error.message));
  }
};

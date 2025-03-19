'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const resp = require('../controllers/base.controller');
const models = require('../models');
const UserModel = models.User;
const db = {};
// Define your route handler function
module.exports = async function handleDatabaseConnection(req, res, next) {
// const handleDatabaseConnection = async (req, res) => {
    try {
        let sequelize;
        if (config.use_env_variable) {
            sequelize = new Sequelize(process.env[config.use_env_variable], config);
        } else {
            sequelize = new Sequelize(config.database, config.username, config.password, config);
            // console.log("dbconnected");
        }
        await sequelize.authenticate();
        
        
        // Perform other operations if the connection is successful
        next()
    } catch (error) {
        // Send an error response
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};


const dotenv = require('dotenv');
dotenv.config();
const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, //config.port, // Add port here
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 100000, // Adjust the timeout settings
    },
    retry: {
      max: 3 // Retry up to 3 times before throwing an error
    },
  });


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 3310, // Specify the MySQL port
    "dialect": process.env.DB_DIALECT,
    
  },
    // "development": {
    //     "username": "root",
    //     "password": "",
    //     "database": "crm_local",
    //     "host": "127.0.0.1",
    //     "dialect": "mysql",
    //     "port": 3310
    // },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
      },
      "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql"
      }

}
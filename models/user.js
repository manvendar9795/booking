  'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
        User.hasMany(models.Booking, { foreignKey: "doctor_id"});
        User.hasMany(models.Booking, { foreignKey: "patient_id"});

        User.belongsTo(models.Address, { foreignKey: "address_id"});
        
        // User.hasMany(models.Leaves, { foreignKey: "doctor_id"});
        User.hasMany(models.Leaves, { foreignKey: "doctor_id", as: "leaves" });

      }
    }
    User.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      mobile: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      user_type: {
        type: DataTypes.ENUM("admin", "doctor", "patient"),
        allowNull: false,
        defaultValue: "patient",
      },
      working_days: {
        type: DataTypes.STRING,
      },
      office_start_time: {
        type: DataTypes.TIME,
      },
      office_end_time: {
        type: DataTypes.TIME,
      },
      duration: {
        type: DataTypes.STRING,
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull:true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Null means not deleted
      },
      is_delete:{
        type: DataTypes.ENUM("true", "false"),
        allowNull: false,
        defaultValue: "false"
      }
      
    },
    {
      sequelize,
      modelName: 'User',
      // paranoid: true, // Enables soft deletion
      // timestamps: true, // Adds createdAt, updatedAt, and deletedAt fields
    });
    return User;
  };
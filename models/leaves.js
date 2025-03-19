'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leaves extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Leaves.belongsTo(models.User, { foreignKey: "doctor_id"});
      Leaves.belongsTo(models.User, { foreignKey: "doctor_id", as: "doctor" });

    }
  }
  Leaves.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    doctor_id: {
      type: DataTypes.INTEGER
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true, // Enables soft delete
    },
  }, {
    sequelize,
    modelName: 'Leaves',
    // paranoid: true, // Enables soft deletion
    // timestamps: true,
  });
  return Leaves;
};
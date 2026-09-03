const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Junction = sequelize.define(
  'Junction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_person: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'persons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    id_car: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cars',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    tableName: 'junction',
    timestamps: false
  }
);

module.exports = Junction;

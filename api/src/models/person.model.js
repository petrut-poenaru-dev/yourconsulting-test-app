const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Person = sequelize.define(
  'Person',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nume: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    prenume: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cnp: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    varsta: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'persons',
    timestamps: true
  }
);

module.exports = Person;

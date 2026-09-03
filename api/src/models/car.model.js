const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define(
  'Car',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    denumire_marca: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    denumire_model: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    an_fabricatie: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacitate_cilindrica: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taxa_impozit: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'cars',
    timestamps: true
  }
);

module.exports = Car;

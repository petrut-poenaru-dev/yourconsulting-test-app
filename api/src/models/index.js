const sequelize = require('../config/database');
const Person = require('./person.model');
const Car = require('./car.model');
const Junction = require('./junction.model');

Person.belongsToMany(Car, {
  through: Junction,
  foreignKey: 'id_person',
  otherKey: 'id_car',
  as: 'cars',
  onDelete: 'CASCADE'
});

Car.belongsToMany(Person, {
  through: Junction,
  foreignKey: 'id_car',
  otherKey: 'id_person',
  as: 'persons',
  onDelete: 'CASCADE'
});

Person.hasMany(Junction, { foreignKey: 'id_person', onDelete: 'CASCADE' });
Junction.belongsTo(Person, { foreignKey: 'id_person' });

Car.hasMany(Junction, { foreignKey: 'id_car', onDelete: 'CASCADE' });
Junction.belongsTo(Car, { foreignKey: 'id_car' });

module.exports = {
  sequelize,
  Person,
  Car,
  Junction
};

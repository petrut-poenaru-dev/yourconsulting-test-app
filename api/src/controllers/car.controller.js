const { Car, Person, Junction } = require('../models');

const carInclude = [{ model: Person, as: 'persons', through: { attributes: [] } }];

async function findAll(req, res) {
  try {
    const cars = await Car.findAll({
      include: carInclude,
      order: [['id', 'ASC']]
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function find(req, res) {
  try {
    const car = await Car.findByPk(req.params.id, { include: carInclude });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { denumire_marca, denumire_model, an_fabricatie, capacitate_cilindrica, taxa_impozit } = req.body;

    if (
      !denumire_marca ||
      !denumire_model ||
      an_fabricatie === undefined ||
      an_fabricatie === null ||
      capacitate_cilindrica === undefined ||
      capacitate_cilindrica === null ||
      taxa_impozit === undefined ||
      taxa_impozit === null
    ) {
      return res.status(400).json({
        message: 'denumire_marca, denumire_model, an_fabricatie, capacitate_cilindrica and taxa_impozit are required'
      });
    }

    const car = await Car.create({
      denumire_marca,
      denumire_model,
      an_fabricatie,
      capacitate_cilindrica,
      taxa_impozit
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const { denumire_marca, denumire_model, an_fabricatie, capacitate_cilindrica, taxa_impozit } = req.body;

    await car.update({
      denumire_marca: denumire_marca !== undefined ? denumire_marca : car.denumire_marca,
      denumire_model: denumire_model !== undefined ? denumire_model : car.denumire_model,
      an_fabricatie: an_fabricatie !== undefined ? an_fabricatie : car.an_fabricatie,
      capacitate_cilindrica: capacitate_cilindrica !== undefined ? capacitate_cilindrica : car.capacitate_cilindrica,
      taxa_impozit: taxa_impozit !== undefined ? taxa_impozit : car.taxa_impozit
    });

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function destroy(req, res) {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await Junction.destroy({ where: { id_car: car.id } });
    await car.destroy();

    res.json({ message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  findAll,
  find,
  create,
  update,
  destroy
};

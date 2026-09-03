const { Person, Car, Junction } = require('../models');

const personInclude = [{ model: Car, as: 'cars', through: { attributes: [] } }];

async function findAll(req, res) {
  try {
    const persons = await Person.findAll({
      include: personInclude,
      order: [['id', 'ASC']]
    });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function find(req, res) {
  try {
    const person = await Person.findByPk(req.params.id, { include: personInclude });
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const { nume, prenume, cnp, varsta, cars } = req.body;

    if (!nume || !prenume || !cnp || varsta === undefined || varsta === null) {
      return res.status(400).json({ message: 'nume, prenume, cnp and varsta are required' });
    }

    const person = await Person.create({ nume, prenume, cnp, varsta });

    if (Array.isArray(cars) && cars.length > 0) {
      await person.setCars(cars);
    }

    const created = await Person.findByPk(person.id, { include: personInclude });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const { nume, prenume, cnp, varsta, cars } = req.body;

    await person.update({
      nume: nume !== undefined ? nume : person.nume,
      prenume: prenume !== undefined ? prenume : person.prenume,
      cnp: cnp !== undefined ? cnp : person.cnp,
      varsta: varsta !== undefined ? varsta : person.varsta
    });

    if (Array.isArray(cars)) {
      await person.setCars(cars);
    }

    const updated = await Person.findByPk(person.id, { include: personInclude });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function destroy(req, res) {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    await Junction.destroy({ where: { id_person: person.id } });
    await person.destroy();

    res.json({ message: 'Person deleted' });
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

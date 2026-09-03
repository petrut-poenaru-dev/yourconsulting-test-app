const express = require('express');
const controller = require('../controllers/person.controller');

const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.find);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

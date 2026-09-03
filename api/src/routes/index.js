const express = require('express');
const personRoutes = require('./person.routes');
const carRoutes = require('./car.routes');

const router = express.Router();

router.use('/persons', personRoutes);
router.use('/cars', carRoutes);

module.exports = router;

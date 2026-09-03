const express = require('express');
const personRoutes = require('./person.routes');

const router = express.Router();

router.use('/persons', personRoutes);

module.exports = router;

require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();

// sequelize connection requiring sequelize/dotenv for credentials
const Sequelize = require('sequelize');
require('dotenv').config();

// sequelize is declared with pointer to the dot env file
let sequelize;
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
    }
  );
}

// exporting sequelize
module.exports = sequelize;

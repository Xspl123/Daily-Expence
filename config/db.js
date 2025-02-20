require('dotenv').config();
const { Sequelize } = require("sequelize");
const config = require("../config/config")[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Error connecting to the database:", err));

module.exports = sequelize;

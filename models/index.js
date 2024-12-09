const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // Enable SSL for external connections in development
        rejectUnauthorized: false, // For self-signed certificates in development
      },
    },
  }
);
const db = {};
db.sequelize = sequelize;

// Manually import models that need specific loading order
const manuallyLoadedModels = ['Role', 'UserUnit', 'User', 'Unit'];

db.Role = require('./roleModel.js')(sequelize, Sequelize);
db.UserUnit = require('./userUnitModel.js')(sequelize, Sequelize);
db.User = require('./userModel.js')(sequelize, Sequelize);
db.Unit = require('./unitModel.js')(sequelize, Sequelize);

// Automatically load remaining models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      !manuallyLoadedModels.includes(file.slice(0, -3)) // Check to exclude manually loaded models
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize
    );
    db[model.name] = model;
  });

// Set up associations for all models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the db object
module.exports = db;

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Unit = sequelize.define(
    'Unit',
    {
      unit_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      unit_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      api_key_hashed: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT, // Use FLOAT for latitude
        allowNull: true, // Optional field
      },
      longitude: {
        type: DataTypes.FLOAT, // Use FLOAT for longitude
        allowNull: true, // Optional field
      },
    },
    {
      tableName: 'units',
      timestamps: true,
    }
  );

  Unit.associate = (models) => {
    Unit.hasMany(models.Sensor, {
      foreignKey: 'unit_id',
      sourceKey: 'unit_id',
    });

    // Many-to-many association with User through UserUnit
    Unit.belongsToMany(models.User, {
      through: models.UserUnit, // Reference the join table model
      foreignKey: 'unit_id',
    });
  };

  return Unit;
};

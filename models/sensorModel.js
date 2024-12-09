const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sensor = sequelize.define(
    'Sensor',
    {
      sensor_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      sensor_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      sensor_type: {
        type: DataTypes.ENUM('temperature', 'humidity', 'both'),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Default to true for new sensors
      },
      unit_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'units', // references Unit table
          key: 'unit_id',
        },
      },
    },
    {
      tableName: 'sensors',
      timestamps: true,
    }
  );

  Sensor.associate = (models) => {
    Sensor.hasMany(models.TemperatureReading, {
      foreignKey: 'sensor_id',
      sourceKey: 'sensor_id',
    });
    Sensor.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      targetKey: 'unit_id',
    });
  };

  return Sensor;
};

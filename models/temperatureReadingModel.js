const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TemperatureReading = sequelize.define(
    'TemperatureReading',
    {
      reading_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      temperature: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      reading_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      sensor_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'sensors', // references Sensor table
          key: 'sensor_id',
        },
      },
    },
    {
      tableName: 'temperature_readings',
      timestamps: true,
    }
  );
  // Inside the TemperatureReading model file
  TemperatureReading.associate = (models) => {
    TemperatureReading.belongsTo(models.Sensor, {
      foreignKey: 'sensor_id',
      targetKey: 'sensor_id',
    });
  };

  return TemperatureReading;
};

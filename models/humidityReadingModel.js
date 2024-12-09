const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HumidityReading = sequelize.define(
    'HumidityReading',
    {
      reading_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      humidity: {
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
      tableName: 'humidity_readings',
      timestamps: true,
    }
  );

  return HumidityReading;
};

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserUnit = sequelize.define(
    'UserUnit',
    {
      user_unit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20), // This could store roles like "admin" or "read"
        allowNull: false,
        defaultValue: 'read',
      },
    },
    {
      tableName: 'user_units',
      timestamps: true,
    }
  );

  UserUnit.associate = (models) => {
    UserUnit.belongsTo(models.User, {
      foreignKey: 'user_id',
    });

    UserUnit.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
    });
  };

  return UserUnit;
};

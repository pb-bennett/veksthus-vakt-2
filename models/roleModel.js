const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.ENUM('super', 'user'),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'roles',
      timestamps: true, // Automatically adds createdAt and updatedAt
    }
  );

  Role.associate = (models) => {
    // A role can be assigned to many users
    Role.hasMany(models.User, {
      foreignKey: 'role_id',
    });
  };

  return Role;
};

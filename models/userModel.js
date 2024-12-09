const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password_hashed: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'role_id',
        },
      },
    },
    {
      tableName: 'users',
      timestamps: true, // createdAt and updatedAt will be handled automatically
    }
  );
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
    });

    // Many-to-many association with Unit through UserUnit
    User.belongsToMany(models.Unit, {
      through: models.UserUnit, // Reference the join table model
      foreignKey: 'user_id',
    });
  };

  return User;
};

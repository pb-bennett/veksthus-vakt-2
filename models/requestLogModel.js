module.exports = (sequelize, DataTypes) => {
  const RequestLog = sequelize.define(
    'RequestLog',
    {
      request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        allowNull: true, // User may not be logged in
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: false, // IP address is required
      },
      request_type: {
        type: DataTypes.STRING(10),
        allowNull: false, // HTTP method (e.g., GET, POST)
      },
      endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false, // The requested endpoint
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false, // Timestamp for when the request was logged
      },
      request_body: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional field to store the request body
      },
    },
    {
      tableName: 'request_logs', // Table name in the DB
      timestamps: false, // No need for Sequelize's default createdAt and updatedAt
    }
  );

  // Add associations if necessary, for example, a user can have many request logs:
  RequestLog.associate = (models) => {
    RequestLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return RequestLog;
};

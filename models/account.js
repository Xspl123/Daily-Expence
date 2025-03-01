"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      // Association: Account belongs to User
      this.belongsTo(models.User, { foreignKey: "user_id" });

      // Association: Account has many Transactions
      this.hasMany(models.Transaction, { foreignKey: "account_id" });
    }
  }

  Account.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_balance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,  // ✅ NULL allowed
        defaultValue: null, // ✅ Default should be NULL
        validate: {
          min: 0, // ✅ Ensure it's positive if provided
        },
      },
      
    
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "accounts",
      timestamps: true,
      underscored: true,
    }
  );

  return Account;
};

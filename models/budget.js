"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      // Budget belongs to a User
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Budget.init(
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      budget_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Budget",
      tableName: "budgets",
      timestamps: true,
      underscored: true, // Ensures snake_case column names
    }
  );

  return Budget;
};

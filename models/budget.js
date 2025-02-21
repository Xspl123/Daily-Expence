"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Category, { foreignKey: "category_id" });
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
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      budget_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Budget",
      tableName: "budgets",
      timestamps: true,
      underscored: true,
    }
  );

  return Budget;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Category belongs to a User
      this.belongsTo(models.User, { foreignKey: "user_id" });

      // Category can have multiple Transactions
      this.hasMany(models.Transaction, { foreignKey: "category_id" });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("Income", "Expense"),
        allowNull: false,
        defaultValue: "Expense", // Default category type
      },
      sort_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0, // Default sort order
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00, // Default total amount
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // Budget can be null if not set
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
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: true,
      paranoid: true, // Soft delete enabled (uses deleted_at)
      underscored: true, // Ensures snake_case column names
    }
  );

  return Category;
};

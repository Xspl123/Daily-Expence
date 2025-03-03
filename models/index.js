const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("admin_panel", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// Import Models
const User = require("./user")(sequelize, DataTypes);
const Account = require("./account")(sequelize, DataTypes);
const Transaction = require("./transaction")(sequelize, DataTypes);
const Category = require("./category")(sequelize, DataTypes);
const Budget = require("./budget")(sequelize, DataTypes);

// Database Object
const db = { sequelize, Sequelize, User, Account, Transaction, Category, Budget };

// Define Associations
User.hasMany(Account, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Account.belongsTo(User, { foreignKey: "user_id" });

Account.hasMany(Transaction, { foreignKey: "account_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Transaction.belongsTo(Account, { foreignKey: "account_id" });

User.hasMany(Transaction, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

Category.hasMany(Transaction, { foreignKey: "category_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Transaction.belongsTo(Category, { foreignKey: "category_id" });

User.hasMany(Category, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
Category.belongsTo(User, { foreignKey: "user_id", as: "user" });

// ✅ **Fixed: Only One Association with `budgets` Alias**
User.hasMany(Budget, { foreignKey: "user_id", as: "budgets" });
Budget.belongsTo(User, { foreignKey: "user_id", as: "user" });

Category.hasMany(Budget, { foreignKey: "category_id", as: "category_budgets" }); // ✅ Changed alias
Budget.belongsTo(Category, { foreignKey: "category_id", as: "category" });

module.exports = db;

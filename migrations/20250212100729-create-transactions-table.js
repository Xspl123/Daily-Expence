module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users', // assuming you create a users table
          key: 'id'
        }
      },
      account_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'accounts', // assuming you create an accounts table
          key: 'id'
        }
      },
      category_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true, // optional category
        references: {
          model: 'categories', // assuming you create a categories table
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM('Income', 'Expense'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};

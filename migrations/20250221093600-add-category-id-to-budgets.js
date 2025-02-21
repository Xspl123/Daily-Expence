module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("budgets", "category_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true, // Agar kisi user ka budget category se linked nahi hai
      references: {
        model: "categories", // Table ka naam
        key: "id", // Foreign key
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("budgets", "category_id");
  },
};
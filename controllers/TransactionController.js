const { Transaction, Account, Category, User, Budget } = require("../models");

const TransactionController = {
  createTransaction: async (req, res) => {
    try {
      const { account_id, category_id, amount, date, description } = req.body;
      const user_id = req.user.userId; // Authenticated user ID

      // ✅ Validate Category
      if (!category_id) {
        return res.status(400).json({ error: "Category is required" });
      }

      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // ✅ Find or Create Budget Entry
      const [budget, created] = await Budget.findOrCreate({
        where: { user_id, category_id },
        defaults: { budget_amount: 0, total_amount: 0 }, // Default values
      });

      // ✅ Calculate New Total Spending
      const newTotalAmount = parseFloat(budget.total_amount || 0) + parseFloat(amount);

      // ✅ Check Budget Constraint
      if (budget.budget_amount && newTotalAmount > budget.budget_amount) {
        return res.status(400).json({ error: "Budget exceeded for this category!" });
      }

      // ✅ Create Transaction
      const transaction = await Transaction.create({
        user_id,
        account_id,
        category_id,
        amount,
        date,
        description,
      });

      // ✅ Update `total_amount` in Budget Table (Ignore Category Table)
      budget.total_amount = newTotalAmount;
      await budget.save();

      return res.status(201).json({
        message: "Transaction created successfully",
        transaction,
      });

    } catch (error) {
      console.error("❌ Error in createTransaction:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"], // User details
          },
          {
            model: Category,
            attributes: ["id", "name", "description"], // Category details
          },
          {
            model: Account,
            attributes: ["id", "account_name", "account_balance"], // Account details
          },
        ],
        order: [["date", "DESC"]], // Latest transactions first
      });

      return res.status(200).json({
        message: "Transactions fetched successfully",
        transactions,
      });
    } catch (error) {
      console.error("❌ Error in getTransactions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = TransactionController;

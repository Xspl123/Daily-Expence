const { Transaction, Account, Category, User, Budget } = require("../models");

const TransactionController = {
  createTransaction: async (req, res) => {
    try {
      const { account_id, category_id, amount, date, description } = req.body;
      const user_id = req.user.userId; // Authenticated user ka ID le rahe hain

      // ✅ Category Validate Karein
      if (!category_id) {
        return res.status(400).json({ error: "Category is required" });
      }

      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // ✅ Budget Entry Find or Create (Agar pehle se nahi hai to create ho)
      const [budget, created] = await Budget.findOrCreate({
        where: { user_id, category_id },
        defaults: { budget_amount: 0, total_amount: 0 }, // Default values
      });

      // ✅ New Total Spending Calculate Karein
      const newTotalAmount = parseFloat(budget.total_amount || 0) + parseFloat(amount);

      // ✅ Budget Check Karein
      if (budget.budget_amount && newTotalAmount > budget.budget_amount) {
        return res.status(400).json({ error: "Budget exceeded for this category!" });
      }

      // ✅ Transaction Create Karein
      const transaction = await Transaction.create({
        user_id,
        account_id,
        category_id,
        amount,
        date,
        description,
      });

      // ✅ Budget Table ka `total_amount` Update Karein (Category table ko ignore karein)
      budget.total_amount = newTotalAmount;
      await budget.save();

      return res.status(201).json({
        message: "Transaction created successfully",
        transaction,
      });

    } catch (error) {
      console.error("Error in createTransaction:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = TransactionController;

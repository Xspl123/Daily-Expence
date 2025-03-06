const { Transaction, Account, Category, User, Budget } = require("../models");

const TransactionController = {
  // ✅ Create Transaction
  async createTransaction(req, res) {
    try {
      const { account_id, category_id, amount, date, description } = req.body;
      const user_id = req.user?.id; // Authenticated user ID

      // ✅ Check authentication
      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized access" });
      }

      // ✅ Validate Inputs
      if (!category_id) return res.status(400).json({ error: "Category is required" });
      if (!account_id) return res.status(400).json({ error: "Account is required" });
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({ error: "Valid date is required" });
      }

      // ✅ Check if Category Exists
      const category = await Category.findOne({ where: { id: category_id, user_id } });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // ✅ Find or Create Budget Entry for the User and Category
      const [budget] = await Budget.findOrCreate({
        where: { user_id, category_id },
        defaults: { budget_amount: 0, total_amount: 0 }, // Default values
      });

      // ✅ Calculate New Total Spending for the Category
      const newTotalAmount = parseFloat(budget.total_amount || 0) + parseFloat(amount);

      // ✅ Check Budget Constraint
      if (budget.budget_amount > 0 && newTotalAmount > budget.budget_amount) {
        return res.status(400).json({ error: "Budget exceeded for this category!" });
      }

      // ✅ Create the Transaction
      const transaction = await Transaction.create({
        user_id,
        account_id,
        category_id,
        amount: parseFloat(amount),
        date: new Date(date),
        description: description?.trim() || "",
      });

      // ✅ Update Budget Total Spending
      await budget.update({ total_amount: newTotalAmount });

      return res.status(201).json({
        message: "Transaction created successfully",
        transaction,
      });
    } catch (error) {
      console.error("❌ Error in createTransaction:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },

  // ✅ Get All Transactions (User-wise)
  async getTransactions(req, res) {
    try {
      const user_id = req.user?.id; // Authenticated user ID

      // ✅ Check authentication
      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized access" });
      }

      // ✅ Fetch Transactions for the Logged-in User
      const transactions = await Transaction.findAll({
        where: { user_id },
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"], // Fetch User details
          },
          {
            model: Category,
            attributes: ["id", "name", "description"], // Fetch Category details
          },
          {
            model: Account,
            attributes: ["id", "account_name", "account_balance"], // Fetch Account details
          },
        ],
        order: [["created_at", "DESC"]], // Sort by latest transactions
      });

      // ✅ Handle Empty Transactions
      if (!transactions.length) {
        return res.status(404).json({ message: "No transactions found" });
      }

      return res.status(200).json({
        message: "Transactions fetched successfully",
        transactions,
      });
    } catch (error) {
      console.error("❌ Error in getTransactions:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },

  // ✅ Update Transaction (User-wise)
  async updateTransaction(req, res) {
    try {
      const { id } = req.params;
      const { amount, date, description } = req.body;
      const user_id = req.user?.id; // Authenticated user ID

      // ✅ Check authentication
      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized access" });
      }

      // ✅ Find Transaction for the User
      const transaction = await Transaction.findOne({
        where: { id: id, user_id },
      });

      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found or unauthorized" });
      }

      // ✅ Update Transaction Fields
      transaction.amount = amount ? parseFloat(amount) : transaction.amount;
      transaction.date = date ? new Date(date) : transaction.date;
      transaction.description = description?.trim() || transaction.description;

      await transaction.save(); // ✅ Save changes

      return res.status(200).json({
        message: "Transaction updated successfully",
        transaction,
      });
    } catch (error) {
      console.error("❌ Error in updateTransaction:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  },

  // ✅ Delete Transaction (User-wise)
  async deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        const user_id = req.user?.id; // Authenticated user ID

        console.log("🟢 Received transaction_id:", id);
        console.log("🟢 Authenticated user_id:", user_id);

        // Check authentication
        if (!user_id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Check if transaction ID is provided
        if (!id) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        // Find the transaction belonging to the authenticated user
        const transaction = await Transaction.findOne({
            where: { id, user_id },
        });

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found or unauthorized" });
        }

        // Convert the transaction amount to a float
        const transactionAmount = parseFloat(transaction.amount);

        // Find the Budget record that corresponds to the transaction's category
        // (Make sure your Budget model has a `category_id` field)
        const budget = await Budget.findOne({
            where: {
                user_id,
                category_id: transaction.category_id,
            },
        });

        if (budget) {
            const oldTotal = parseFloat(budget.total_amount);
            const newTotalAmount = oldTotal - transactionAmount;

            console.log(`Updating Budget for category ${transaction.category_id}: ${oldTotal} -> ${newTotalAmount}`);
            await budget.update({ total_amount: newTotalAmount });
        } else {
            console.log(`No budget record found for user ${user_id} and category ${transaction.category_id}`);
        }

        // Delete the transaction
        await transaction.destroy();

        return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("❌ Error in deleteTransaction:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
}



};

module.exports = TransactionController;

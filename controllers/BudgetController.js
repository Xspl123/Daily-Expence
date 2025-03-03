const { Budget, User, Category } = require("../models");

class BudgetController {
    // ✅ Create or Update Budget
    async createBudget(req, res) {
        try {
            const { category_id, budget_amount } = req.body;

            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            const user_id = req.user.id;

            // Check if budget for this category already exists
            let budget = await Budget.findOne({ where: { user_id, category_id } });

            if (budget) {
                // ✅ Update existing budget
                budget.budget_amount = budget_amount;
                await budget.save();
                return res.status(200).json({
                    message: "Budget updated successfully",
                    budget
                });
            } else {
                // ✅ Create new budget entry
                budget = await Budget.create({
                    user_id,
                    category_id,
                    budget_amount
                });

                return res.status(201).json({
                    message: "Budget set successfully",
                    budget
                });
            }
        } catch (error) {
            console.error("Error setting/updating budget:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    // ✅ Fetch Budgets
    async getBudgets(req, res) {
        try {
            const user_id = req.user?.id;

            if (!user_id) {
                return res.status(401).json({ error: "Unauthorized access" });
            }

            const budgets = await Budget.findAll({
                where: { user_id },
                include: [
                    { model: User, as: "user", attributes: ["id", "name", "email"] },
                    { model: Category, as: "category", attributes: ["id", "name", "description"] },
                ],
                order: [["createdAt", "DESC"]]
            });

            return res.status(200).json({
                message: "Budgets fetched successfully",
                budgets,
            });
        } catch (error) {
            console.error("❌ Error in getBudgets:", error);
            return res.status(500).json({
                error: "Internal Server Error",
                details: error.message,
            });
        }
    }
}

// ✅ Correctly Export Class-Based Controller
module.exports = new BudgetController();

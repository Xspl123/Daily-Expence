const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");

// POST - Create a new transaction
router.post("/create-transaction", TransactionController.create);

// GET - Get all transactions
router.get("/get-all-transaction", TransactionController.getAll);

// GET - Get a transaction by ID
router.get("/transaction-by-id/:id", TransactionController.getById);

// PUT - Update a transaction by ID
router.put("/update-transaction/:id", TransactionController.update);

// DELETE - Delete a transaction by ID
router.delete("/delete-transaction/:id", TransactionController.delete);

module.exports = router;

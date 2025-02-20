const { Sequelize } = require('sequelize');
const { Transaction } = require('../models');


const TransactionController = {
  // ✅ Create a Transaction
  async create(req, res) {
    try {
      //console.log('Request Body:', req.body); 
      const transaction = await Transaction.create(req.body);
      return res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  

  // ✅ Get All Transactions
  async getAll(req, res) {
    try {
      const transactions = await Transaction.findAll();
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // ✅ Get Single Transaction by ID
  async getById(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.params.id);
      if (!transaction) return res.status(404).json({ error: "Transaction not found" });
      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // ✅ Update a Transaction
  async update(req, res) {
    try {
      const [updated] = await Transaction.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) return res.status(404).json({ error: "Transaction not found" });
      return res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // ✅ Delete a Transaction
  async delete(req, res) {
    try {
      const deleted = await Transaction.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: "Transaction not found" });
      return res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TransactionController;

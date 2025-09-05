const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.use(auth); // All routes require authentication

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/stats', getTransactionStats);

router.route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;

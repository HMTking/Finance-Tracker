const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createDefaultCategories
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.use(auth); // All routes require authentication

router.route('/')
  .get(getCategories)
  .post(createCategory);

router.post('/defaults', createDefaultCategories);

router.route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;

const express =require('express');
const router =express.Router();
const CategoryController = require("../controllers/category.controller");

router.post('/',CategoryController.addEditCategory);
router.get('/',CategoryController.getCategories);
router.delete('/',CategoryController.deleteCategory);




module.exports = router;
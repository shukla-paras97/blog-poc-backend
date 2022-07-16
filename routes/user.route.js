const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth')

router.post('/register',UserController.registerUser);
router.post('/login',UserController.loginUser);
router.post('/editProfile',verifyToken,UserController.editProfile);
router.get('/me',verifyToken,UserController.getMyData);
router.get('/bloggerProfile/:bloggerId', UserController.getBloggerProfile);
router.get('/getalluser',UserController.getAllUser);
module.exports= router;
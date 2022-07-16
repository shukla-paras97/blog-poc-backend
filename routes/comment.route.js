const express =require('express');
const router =express.Router();
const CommentController = require("../controllers/comment.controller");
const verifyAccessToken = require('../middlewares/auth');

router.post('/',verifyAccessToken,CommentController.createEditComment);
router.get('/:postid',CommentController.getAllComment);
router.delete('/',verifyAccessToken,CommentController.deleteComment);




module.exports = router;
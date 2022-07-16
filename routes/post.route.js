// imports
const express = require('express');
const postController = require('../controllers/post.controller');

const verifyAccessToken = require('../middlewares/auth')

var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (request, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (request, file, cb) {
    //   cb(null, Date.now() + '.' + file.originalname.split('.').reverse()[0])
         cb(null,new Date().toISOString().replace(/:/g, '-')+ file.originalname);
    }
});

const fileFilter = (request, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };


var upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

// constants
const router = express.Router();

// route: blog/

router.post('/', verifyAccessToken, upload.single('photo'), verifyAccessToken, postController.addEditPost);
router.get('/',postController.getAllPost);
router.delete('/',verifyAccessToken,postController.deletePost);
router.get('/:categoryid',postController.getPostByCategory)



// exports
module.exports = router;
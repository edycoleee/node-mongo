//routes/postRoutes.js
const express = require('express');

const postController = require('../controller/postController.js');
const protect = require('../middleware/authMiddleware.js');

const router = express.Router();

router
    .route('/')
    .get(postController.getAllPosts)
    .post(protect, postController.createPosts)

router
    .route('/:id')
    .get(protect, postController.getOnePosts)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost)

module.exports = router;
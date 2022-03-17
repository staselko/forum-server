import express from 'express';
import {
  createPost, readPosts, getTargetPost, deletePost, editPost,
} from '../controllers/post';

const router = express.Router();

router.get('/', readPosts);
router.post('/', createPost);
router.get('/:postId', getTargetPost);
router.delete('/:postId', deletePost);
router.patch('/', editPost);
export default router;

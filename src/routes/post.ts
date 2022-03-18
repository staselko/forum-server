import express from 'express';
import { paginatedResults } from '../middlewares/pagination';
import {
  createPost, readPosts, getTargetPost, deletePost, editPost,
} from '../controllers/post';

const router = express.Router();

router.get('/', paginatedResults(), readPosts);
router.post('/', createPost);
router.get('/:postId', getTargetPost);
router.delete('/:postId', deletePost);
router.patch('/', editPost);
export default router;

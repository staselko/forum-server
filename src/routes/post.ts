import express from 'express';
import { createPost, readPosts, getTargetPost } from '../controllers/post';

const router = express.Router();

router.get('/', readPosts);
router.post('/', createPost);
router.get('/:postId', getTargetPost);
export default router;

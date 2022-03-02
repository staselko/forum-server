import express from 'express';
import { createPost, readPosts } from '../controllers/post';

const router = express.Router();

router.get('/', readPosts);
router.post('/', createPost);

export default router;

import express from 'express';
import {
  createComment, readComments,
  getTargetComments, redactComment, deleteComment,
} from '../controllers/comments';

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', readComments);
router.get('/:postId', getTargetComments);
router.delete('/', deleteComment);
router.post('/', authMiddleware, createComment);
router.patch('/', redactComment);
export default router;

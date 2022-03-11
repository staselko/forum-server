import express from 'express';
import {
  createComment, readComments,
  getTargetComments, redactComment, deleteComment,
} from '../controllers/comments';

const router = express.Router();

router.get('/', readComments);
router.get('/:postId', getTargetComments);
router.delete('/', deleteComment);
router.post('/', createComment);
router.patch('/', redactComment);
export default router;

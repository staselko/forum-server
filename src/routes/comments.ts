import express from 'express';
import {
  createComment, readComments,
  getTargetComments, redactComment,
} from '../controllers/comments';

const router = express.Router();

router.get('/', readComments);
router.get('/:postId', getTargetComments);
router.post('/', createComment);
router.patch('/', redactComment);
export default router;

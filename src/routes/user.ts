import express from 'express';
import {
  readUsers, createUser, readTargetUser, editUser, deleteUser,
} from '../controllers/user';

// const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', readUsers);
router.post('/', createUser);
router.get('/:userId', readTargetUser);
router.patch('/:userId', editUser);
router.delete('/:userId', deleteUser);

export default router;

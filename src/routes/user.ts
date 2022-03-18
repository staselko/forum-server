import express from 'express';
import {
  readUsers, readTargetUser, editUser, deleteUser, readUsersTargetPage,
} from '../controllers/user';
import { paginatedResults } from '../middlewares/pagination';

const router = express.Router();

router.get('/', paginatedResults(), readUsers);
router.get('/:userId', readTargetUser);
router.patch('/:userId', editUser);
router.delete('/:userId', deleteUser);
router.get('/p/:usersPaginationNum', readUsersTargetPage);

export default router;

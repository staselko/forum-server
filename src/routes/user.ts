import express from 'express';
import {
  readUsers, readTargetUser, editUser, deleteUser, readUsersTargetPage,
} from '../controllers/user';

const router = express.Router();

router.get('/', readUsers);
router.get('/:userId', readTargetUser);
router.patch('/:userId', editUser);
router.delete('/:userId', deleteUser);
router.get('/p/:usersPaginationNum', readUsersTargetPage);

export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  registration,
  activate,
  login,
  logout,
  refresh,
} from '../controllers/user';

const router = express.Router();

router.post(
  '/registration',
  body('email').isEmail().isEmpty().isLength({ min: 5, max: 32 }),
  body('password').isLength({ min: 8, max: 16 }),
  registration,
);
router.get('/activate/:link', activate);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refresh);

export default router;

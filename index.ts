import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import postRouter from './src/routes/post';
import userRouter from './src/routes/user';
import authRouter from './src/routes/index';
import commentRouter from './src/routes/comments';

dotenv.config();

const multer = require('multer');
const logger = require('./src/logger');
const errorMiddleware = require('./src/middlewares/errors');

const upload = multer();

const { PORT, MONGODB, FRONT_URL } = process.env;

const app = express();
dotenv.config();

app.use(upload.array());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: FRONT_URL,
}));
app.use(cookieParser());
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/', authRouter);
app.listen(PORT);
mongoose.set('useFindAndModify', false);
mongoose.connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => logger.info('Successfully connected to database'));

app.get('/', async (req, res) => {
  res.send(`Server is working on port ${PORT}`);
});

app.use(errorMiddleware);

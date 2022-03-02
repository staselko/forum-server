/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRouter from './src/routes/post';
import userRouter from './src/routes/user';

const MONGODB = 'mongodb+srv://staselko:staselya2002@cluster0.9oryx.mongodb.net/forum?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.listen(PORT);

dotenv.config();

mongoose.connect(MONGODB, { useUnifiedTopology: true })
  .then(() => console.log('\x1b[32m', 'Successfully connected to the database'))
  .catch((err) => console.log('\x1b[31m', 'Could not connect to the database. Error...', err));

app.get('/', (req, res) => {
  console.log('\x1b[32m', `Server is working on port ${PORT}`);
  res.send(`Server is working on port ${PORT}`);
});

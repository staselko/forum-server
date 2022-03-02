import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  userId: String,
  title: String,
  body: String,
  id: String,
}, { timestamps: true });

const Post = mongoose.model('post', postSchema);

export default Post;

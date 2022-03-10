import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentsSchema = new Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  body: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model('comment', CommentsSchema);

export default Comment;

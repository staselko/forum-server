import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  imageUrl: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment', required: true }],
  id: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.model('post', PostSchema);

export default Post;

import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  phone: { type: String, required: true },
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  username: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  posts: [{
    type: Schema.Types.ObjectId, ref: 'Post',
  }],
  commets: [{
    type: Schema.Types.ObjectId, ref: 'Comment',
  }],
}, { timestamps: true });

const User = mongoose.model('user', UserSchema);

export default User;

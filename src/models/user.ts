import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  id: String,
  firstName: String,
  secondName: String,
  username: String,
  email: String,
  phone: String,
  password: String,
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export default User;

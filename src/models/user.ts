import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  // id: { type: String, unique: true, required: true },
  // firstName: { type: String, required: true },
  // secondName: { type: String, required: true },
  // username: { type: String, required: true },
  // email: { type: String, unique: true, required: true },
  // phone: { type: String, required: true },
  // isActivated: { type: Boolean, default: false },
  // activationLink: { type: String },
  // password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
}, { timestamps: true });

const User = mongoose.model('user', UserSchema);

export default User;

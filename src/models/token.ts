import mongoose from 'mongoose';

const { Schema } = mongoose;

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
}, { timestamps: true });

const Token = mongoose.model('token', TokenSchema);

export default Token;

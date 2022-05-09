import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    bio: {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      occupation: {
        type: String,
        default: '',
      },
      profileDescription: {
        type: [String],
        default: [''],
      },
    },
    posts: {
      type: [Schema.Types.ObjectId],
      ref: 'post',
      default: [],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
  },
  { timestamps: true },
);

const User = model('user', userSchema);

export default User;

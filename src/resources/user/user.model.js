import mongoose from 'mongoose';

const { Schema, SchemaType, model } = mongoose;

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
      type: [SchemaType.ObjectId],
      ref: 'post',
      default: [],
    },
    followers: {
      type: [SchemaType.ObjectId],
      ref: 'user',
      default: [],
    },
    following: {
      type: [SchemaType.ObjectId],
      ref: 'user',
      default: [],
    },
  },
  { timestamps: true },
);

const User = model('user', userSchema);

export default User;

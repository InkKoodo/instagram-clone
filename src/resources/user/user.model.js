import mongoose from 'mongoose';

const { Schema } = mongoose;

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
    followers: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'user',
      default: [],
    },
    following: {
      type: [mongoose.SchemaType.ObjectId],
      ref: 'user',
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model('user', userSchema);

export default User;

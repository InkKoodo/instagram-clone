import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const storySchema = new Schema({}, { timestamps: true }); // todo: fill storySchema

const storiesCollectionSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    headImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    media: {
      type: [storySchema],
      default: [],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

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
    password: {
      type: String,
      required: true,
      select: false,
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
    subscriptions: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    userCollections: {
      type: [Schema.Types.ObjectId],
      ref: 'user_collection', // todo: create separate userCollection
      default: [],
    },
    userStoryCollections: {
      type: [storiesCollectionSchema],
      default: [],
    },
  }, // todo: add conversations model later
  { timestamps: true },
);

// todo: Resolve eslint issue
// eslint-disable-next-line consistent-return
userSchema.pre('save', async function hashPassword(next) {
  // check if password was changed
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (e) {
    return next(e);
  }
});

const User = model('user', userSchema);

export default User;

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const likeSchema = new Schema({
  likesCounter: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
});

const commentSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    message: {
      type: String,
    },
    likes: {
      type: likeSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);
commentSchema.add({
  replies: {
    type: [commentSchema],
    default: [],
  },
});

const postSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    media: {
      type: [String], // todo: change on real image links
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    likes: {
      type: likeSchema,
      default: () => ({}), // pass the schema defaults to its parent defaults
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    parentCollections: {
      type: [Schema.Types.ObjectId],
      ref: 'userCollection',
      default: [],
    },
  },
  { timestamps: true },
);

const Post = model('post', postSchema);

export default Post;

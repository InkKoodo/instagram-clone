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
    likes: likeSchema,
  },
  { timestamps: true },
);
commentSchema.add({
  replies: [commentSchema],
});

const postSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    media: {
      type: [String], // todo: change on real image links
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    likes: likeSchema, // add this if defaults of nested schema is undefined and couner shows undefind instead of default 0 value : default: () => ({})
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Post = model('post', postSchema);

export default Post;

import mongoose from 'mongoose';

const { Schema, SchemaType, model } = mongoose;

const likeSchema = new Schema({
  likesCounter: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [SchemaType.ObjectId],
    ref: 'user',
    default: [],
  },
});

const commentSchema = new Schema(
  {
    from: {
      type: SchemaType.ObjectId,
      ref: 'user',
    },
    message: {
      type: String,
      required: true,
    },
    likes: likeSchema,
    replies: [this],
  },
  { timestamps: true },
);

const postSchema = new Schema(
  {
    media: {
      type: [String], // todo: change on real image links
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    likes: likeSchema,
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Post = model('post', postSchema);

export default Post;

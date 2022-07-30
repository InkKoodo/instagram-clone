import Post from './post.model';
import User from '../user/user.model';

export const createPost = async (req, res) => {
  try {
    const { userId } = req.jwtData;
    const newPost = await Post.create({
      createdBy: userId,
      ...req.body,
    });
    const { _id } = newPost;

    // add post to User
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { posts: _id } },
    );

    return res.status(200).json({ data: newPost });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate(['createdBy', 'parentCollections']);

    if (!post) return res.status(400).json({ error: { message: 'This post doesn\'t exists anymore' } });

    return res.status(200).json({ data: post });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { userId } = req.jwtData;
    const { posts } = await User.findById(userId).populate('posts');

    return res.status(200).json({ data: posts });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

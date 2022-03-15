/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import Post from '../models/post';
import User from '../models/user';

const UserDto = require('../dtos/user');
const ApiError = require('../exceptions/api-error');

export const readPosts = async (req: any, res: any) => {
  try {
    const posts = await Post.find()
      .populate('user')
      .then((data: any) => {
        data.forEach((post: any) => {
          post.user = new UserDto(post.user);
        });

        if (!data.length) {
          throw ApiError.BadRequest('No posts');
        }
        return data;
      });
    return res.status(200).json(posts);
  } catch (error: unknown) {
    res.status(400).json({ error });
  }
};

export const createPost = async (req: any, res: any) => {
  const post = new Post(req.body);
  try {
    await post.save();
    const user = await User.findOne({ _id: req.body.user });

    if (!user.id) {
      throw ApiError.BadRequest('No such user');
    }

    user.posts.push(post._id);
    await user.save();
    res.status(200).json(post);
  } catch (error: unknown) {
    res.status(400).json({ error });
  }
};

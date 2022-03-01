import Post from '../models/post';

export const readPosts = async (req: any, res: any) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error: unknown) {
    res.status(404).json({ error });
  }
};

export const createPost = async (req: any, res: any) => {
  const post = new Post(req.body);

  try {
    await post.save();
    res.status(201).json(post);
  } catch (error: unknown) {
    res.status(409).json({ error });
  }
};

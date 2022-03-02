import User from '../models/user';

export const readUsers = async (req: any, res: any) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const createUser = async (req: any, res: any) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const readTargetUser = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ id: userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const editUser = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const user = await User.findOneAndUpdate({ id: userId }, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error });
  }
};

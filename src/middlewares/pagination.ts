import { NextFunction, Request } from 'express';

export const paginatedResults = () => async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  const page = Number(req.query.page);
  const limit = page * 10;
  const quantity = page * 5;
  try {
    res.limit = limit;
    res.quantity = quantity;
    next();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

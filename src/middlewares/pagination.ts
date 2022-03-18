import { NextFunction, Request } from 'express';

export const paginatedResults = () => async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  const page = Number(req.query.page);
  const limit = page * 10;

  try {
    res.limit = limit;
    next();
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

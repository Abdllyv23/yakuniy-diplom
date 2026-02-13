import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

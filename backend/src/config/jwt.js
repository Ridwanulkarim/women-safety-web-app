import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  const errorMsg = 'FATAL SECURITY ERROR: JWT_SECRET environment variable is not defined.';
  console.error(errorMsg);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    throw new Error(errorMsg);
  }
}

const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};


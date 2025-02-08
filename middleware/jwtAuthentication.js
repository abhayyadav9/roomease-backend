import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie('token', token, {
    httpOnly: true, // Corrected typo
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
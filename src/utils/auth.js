import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; // Store this in your .env.local file

// Function to create a JWT token
export function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Function to verify a JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

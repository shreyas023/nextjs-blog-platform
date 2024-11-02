import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; // Store this in your .env.local file

// Ensure JWT_SECRET is defined
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Function to create a JWT token
export function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Function to verify a JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Token verification error:', error); // Log the error
    return null; // Return null if verification fails
  }
}

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwt.decode(token); // Decode the token payload
    if (!exp) return true;

    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    return exp < currentTime; // Token is expired if current time is past the expiration time
  } catch (error) {
    console.error("Token decoding error:", error);
    return true;
  }
}
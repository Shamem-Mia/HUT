import jwt from "jsonwebtoken";

export const createToken = (email, role, shop) => {
  const payload = {
    email: email,
    role: role, // e.g., "admin", "user", "moderator"
    shop: shop,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  }); // Expires in 1 hour

  return token;
};

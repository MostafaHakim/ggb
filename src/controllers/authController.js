import jwt from "jsonwebtoken";
import User from "../models/User.js";
const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Email or password is incorrect." });
  if (!user.active)
    return res.status(403).json({ message: "This account is disabled." });
  res.json({
    token: makeToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}
export async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

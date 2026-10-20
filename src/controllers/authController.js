import jwt from "jsonwebtoken";
import User from "../models/User.js";
const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
export async function login(req, res) {
  const { empId, password } = req.body;
  if (!empId || !password)
    return res.status(400).json({ message: "ID and password are required." });
  const user = await User.findOne({ empId: empId }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "EmpId or password is incorrect." });
  if (!user.active)
    return res.status(403).json({ message: "This account is disabled." });
  res.json({
    token: makeToken(user),
    user: { id: user._id, name: user.name, empId: user.empId, role: user.role },
  });
}
export async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      empId: req.user.empId,
      role: req.user.role,
    },
  });
}

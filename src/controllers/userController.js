import User from "../models/User.js";
export async function createIncharge(req, res) {
  const { name, empId, password } = req.body;
  if (!name || !empId || !password || password.length < 8)
    return res.status(400).json({
      message: "Name, empId and password (at least 8 characters) are required.",
    });
  if (await User.exists({ empId }))
    return res
      .status(409)
      .json({ message: "An account with this email already exists." });
  const user = await User.create({ name, email, password, role: "incharge" });
  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      empId: user.empId,
      role: user.role,
    },
  });
}
export async function listUsers(req, res) {
  const users = await User.find({ role: "incharge" }).select(
    "name empId active createdAt",
  );
  res.json({ users });
}

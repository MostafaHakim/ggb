import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
await mongoose.connect(process.env.MONGO_URI);
const empId = (process.env.ADMIN_EMPID || "110081").toLowerCase();
let user = await User.findOne({ empId });
if (user) console.log(`Admin already exists: ${empId}`);
else {
  user = await User.create({
    name: process.env.ADMIN_NAME || "MD Mostafa",
    empId,
    password: process.env.ADMIN_PASSWORD || "Admin@12345",
    role: "admin",
  });
  console.log(`Admin created: ${user.empId}`);
}
await mongoose.disconnect();

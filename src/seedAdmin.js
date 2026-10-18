import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
await mongoose.connect(process.env.MONGO_URI);
const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
let user = await User.findOne({ email });
if (user) console.log(`Admin already exists: ${email}`);
else {
  user = await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    email,
    password: process.env.ADMIN_PASSWORD || "Admin@12345",
    role: "admin",
  });
  console.log(`Admin created: ${user.email}`);
}
await mongoose.disconnect();

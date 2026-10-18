import { Router } from "express";
import { createIncharge, listUsers } from "../controllers/userController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect, allowRoles("admin"));
router.route("/incharges").get(listUsers).post(createIncharge);
export default router;

import { Router } from "express";
import {
  listEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.route("/").get(listEmployees).post(createEmployee);
router.route("/:id").patch(updateEmployee).delete(deleteEmployee);
export default router;

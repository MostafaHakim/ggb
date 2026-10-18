import { Router } from "express";
import {
  createSection,
  listSections,
  applyToSection,
  reviewApplication,
} from "../controllers/sectionController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect);
router.route("/").get(listSections).post(allowRoles("admin"), createSection);
router.post("/:id/apply", allowRoles("incharge"), applyToSection);
router.patch(
  "/:id/applications/:applicationId",
  allowRoles("admin"),
  reviewApplication,
);
export default router;

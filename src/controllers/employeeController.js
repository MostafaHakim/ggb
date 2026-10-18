import Employee from "../models/Employee.js";
import Section from "../models/Section.js";
export async function listEmployees(req, res) {
  const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
  if (req.query.section) filter.section = req.query.section;
  const employees = await Employee.find(filter)
    .populate("section", "name")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
  res.json({ employees });
}
export async function createEmployee(req, res) {
  const { employeeId, name, phone, email, designation, joiningDate, section } =
    req.body;
  if (!employeeId || !name || !designation || !section)
    return res
      .status(400)
      .json({
        message: "Employee ID, name, designation and section are required.",
      });
  const sectionDoc = await Section.findById(section);
  if (!sectionDoc || !sectionDoc.active)
    return res.status(400).json({ message: "Choose a valid active section." });
  const access = sectionDoc.applications.find(
    (a) => String(a.user) === String(req.user._id) && a.status === "approved",
  );
  if (req.user.role !== "admin" && !access)
    return res
      .status(403)
      .json({
        message:
          "Admin approval is required before adding employees to this section.",
      });
  if (await Employee.exists({ employeeId: employeeId.trim() }))
    return res.status(409).json({ message: "Employee ID already exists." });
  const employee = await Employee.create({
    employeeId,
    name,
    phone,
    email,
    designation,
    joiningDate: joiningDate || undefined,
    section,
    createdBy: req.user._id,
  });
  res
    .status(201)
    .json({ employee: await employee.populate("section", "name") });
}
export async function updateEmployee(req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee)
    return res.status(404).json({ message: "Employee not found." });
  if (
    req.user.role !== "admin" &&
    String(employee.createdBy) !== String(req.user._id)
  )
    return res.status(403).json({ message: "Not allowed." });
  const allowed = [
    "name",
    "phone",
    "email",
    "designation",
    "joiningDate",
    "status",
  ];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) employee[key] = req.body[key];
  });
  await employee.save();
  res.json({ employee });
}
export async function deleteEmployee(req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee)
    return res.status(404).json({ message: "Employee not found." });
  if (
    req.user.role !== "admin" &&
    String(employee.createdBy) !== String(req.user._id)
  )
    return res.status(403).json({ message: "Not allowed." });
  await employee.deleteOne();
  res.json({ message: "Employee deleted." });
}

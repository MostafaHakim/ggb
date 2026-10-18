import Section from "../models/Section.js";
export async function createSection(req, res) {
  const { name, description = "" } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Section name is required." });
  const section = await Section.create({ name: name.trim(), description });
  res.status(201).json({ section });
}
export async function listSections(req, res) {
  const sections = await Section.find()
    .populate("applications.user", "name email")
    .sort({ name: 1 });
  if (req.user.role === "admin") return res.json({ sections });
  const visible = sections.map((s) => ({
    _id: s._id,
    name: s.name,
    description: s.description,
    active: s.active,
    myApplication:
      s.applications.find(
        (a) => String(a.user?._id || a.user) === String(req.user._id),
      )?.status || null,
  }));
  res.json({ sections: visible });
}
export async function applyToSection(req, res) {
  const section = await Section.findById(req.params.id);
  if (!section || !section.active)
    return res.status(404).json({ message: "Active section not found." });
  const existing = section.applications.find(
    (a) => String(a.user) === String(req.user._id),
  );
  if (existing?.status === "approved")
    return res
      .status(409)
      .json({ message: "You already have approved access to this section." });
  if (existing) {
    existing.status = "pending";
    existing.appliedAt = new Date();
    existing.reviewedAt = undefined;
    existing.reviewedBy = undefined;
  } else section.applications.push({ user: req.user._id, status: "pending" });
  await section.save();
  res.json({
    message: "Section access application submitted.",
    status: "pending",
  });
}
export async function reviewApplication(req, res) {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res
      .status(400)
      .json({ message: "Status must be approved or rejected." });
  const section = await Section.findById(req.params.id);
  if (!section) return res.status(404).json({ message: "Section not found." });
  const application = section.applications.id(req.params.applicationId);
  if (!application)
    return res.status(404).json({ message: "Application not found." });
  application.status = status;
  application.reviewedAt = new Date();
  application.reviewedBy = req.user._id;
  await section.save();
  res.json({ message: `Application ${status}.`, section });
}

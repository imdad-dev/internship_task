const Notification = require("../models/Notification");

// Works for whichever role is logged in - determined by which session key is present
function getSessionRole(req) {
  if (req.session.employer) return { type: "employer", id: req.session.employer.id };
  if (req.session.candidate) return { type: "candidate", id: req.session.candidate.id };
  return null;
}

exports.getMyNotifications = async (req, res) => {
  try {
    const role = getSessionRole(req);
    if (!role) return res.status(401).json({ success: false, message: "Login required" });

    const notifications = await Notification.find({ recipientType: role.type, recipient: role.id })
      .sort({ createdAt: -1 })
      .limit(30);
    const unreadCount = await Notification.countDocuments({ recipientType: role.type, recipient: role.id, isRead: false });

    res.json({ success: true, unreadCount, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const role = getSessionRole(req);
    if (!role) return res.status(401).json({ success: false, message: "Login required" });

    await Notification.updateMany({ recipientType: role.type, recipient: role.id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      recipientModel: req.role === "user" ? "User" : "ServiceProvider",
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Error loading notifications", error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification", error: err.message });
  }
};

const Notification = require("../models/Notification");

const sendNotification = async ({
  recipient,
  recipientModel,
  message,
  bookingId = null,
}) => {
  try {
    const note = await Notification.create({
      recipient,
      recipientModel,
      message,
      booking: bookingId,
    });

    // TODO: emit via Socket.IO later
    // io.to(recipientId).emit('new-notification', note);

    return note;
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

module.exports = sendNotification;

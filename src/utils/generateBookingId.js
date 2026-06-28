const Booking = require('../models/Booking');

/**
 * Generates a sequential Booking ID in the format BK-YYYY-NNN
 * e.g. BK-2026-001
 */
const generateBookingId = async () => {
  const year = new Date().getFullYear();
  const prefix = `BK-${year}-`;

  // Count how many bookings exist for this year
  const count = await Booking.countDocuments({
    bookingId: { $regex: `^${prefix}` },
  });

  const seq = String(count + 1).padStart(3, '0');
  return `${prefix}${seq}`;
};

module.exports = generateBookingId;

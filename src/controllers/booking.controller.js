const Booking            = require('../models/Booking');
const generateBookingId  = require('../utils/generateBookingId');
const sendMail           = require('../utils/sendMail');

// ─── Create booking (public — guest or logged-in) ────────────────────────────
// POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, eventType, venue, package: pkg, addons, guestRange, date, notes } = req.body;

    if (!name || !email || !phone || !eventType || !date) {
      return res.status(400).json({ success: false, message: 'name, email, phone, eventType, and date are required' });
    }

    const bookingId = await generateBookingId();

    const booking = await Booking.create({
      bookingId,
      user:      req.user?._id || null,
      name, email, phone,
      eventType, venue: venue || '', package: pkg || '',
      addons:    Array.isArray(addons) ? addons : [],
      guestRange: guestRange || '',
      date, notes: notes || '',
    });

    // Send confirmation email (non-blocking)
    try {
      const template = sendMail.bookingConfirmation({ name, bookingId, eventType, date, venue });
      await sendMail({ to: email, ...template });
    } catch (mailErr) {
      console.warn('⚠️  Confirmation email failed (booking still saved):', mailErr.message);
    }

    res.status(201).json({ success: true, bookingId: booking.bookingId, booking });
  } catch (error) {
    next(error);
  }
};

// ─── Track booking (public — by bookingId + phone) ───────────────────────────
// GET /api/bookings/track?id=BK-2026-001&phone=9876543210
exports.trackBooking = async (req, res, next) => {
  try {
    const { id, phone } = req.query;
    if (!id || !phone) {
      return res.status(400).json({ success: false, message: 'Booking ID and phone are required' });
    }

    const booking = await Booking.findOne({ bookingId: id.trim() });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'No booking found with this ID and phone number combination.' });
    }

    // Verify phone (last 10 digits)
    const normalize = (p) => p.replace(/\D/g, '').slice(-10);
    if (normalize(booking.phone) !== normalize(phone)) {
      return res.status(404).json({ success: false, message: 'No booking found with this ID and phone number combination.' });
    }

    // Return booking but hide email for privacy
    const { email: _email, user: _user, ...safeBooking } = booking.toObject();
    res.json({ success: true, booking: safeBooking });
  } catch (error) {
    next(error);
  }
};

// ─── Get all bookings (admin) ─────────────────────────────────────────────────
// GET /api/bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const { email, status, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (email)  filter.email  = { $regex: email, $options: 'i' };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), bookings });
  } catch (error) {
    next(error);
  }
};

// ─── Get bookings by logged-in user ──────────────────────────────────────────
// GET /api/bookings/my  (protected)
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// ─── Get single booking by ID (admin) ────────────────────────────────────────
// GET /api/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// ─── Update booking — status + adminNotes (admin) ────────────────────────────
// PATCH /api/bookings/:id
exports.updateBooking = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status)                 booking.status     = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// ─── Delete booking (admin) ───────────────────────────────────────────────────
// DELETE /api/bookings/:id
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete({ bookingId: req.params.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    next(error);
  }
};

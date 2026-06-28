const express  = require('express');
const router   = express.Router();
const {
  createBooking, trackBooking, getAllBookings,
  getMyBookings, getBookingById, updateBooking, deleteBooking,
} = require('../controllers/booking.controller');
const { protect }  = require('../middleware/auth');
const adminOnly    = require('../middleware/admin');

// Public
router.post('/',          createBooking);   // guest or logged-in
router.get('/track',      trackBooking);    // track by bookingId + phone

// Protected (logged-in user)
router.get('/my',         protect, getMyBookings);

// Admin only
router.get('/',           protect, adminOnly, getAllBookings);
router.get('/:id',        protect, adminOnly, getBookingById);
router.patch('/:id',      protect, adminOnly, updateBooking);
router.delete('/:id',     protect, adminOnly, deleteBooking);

module.exports = router;

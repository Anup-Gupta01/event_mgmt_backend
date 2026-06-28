const User    = require('../models/User');
const Booking = require('../models/Booking');

// ─── Dashboard stats ──────────────────────────────────────────────────────────
// GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalBookings, pending, approved, completed, rejected, totalUsers] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: { $in: ['Approved', 'Confirmed'] } }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Rejected' }),
      User.countDocuments({ role: 'user' }),
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: { totalBookings, pending, approved, completed, rejected, totalUsers },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get all users ────────────────────────────────────────────────────────────
// GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// ─── Toggle user active status ────────────────────────────────────────────────
// PATCH /api/admin/users/:id/toggle
exports.toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    next(error);
  }
};

// ─── Delete user ──────────────────────────────────────────────────────────────
// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type:     String,
      unique:   true,
      required: true,
    },
    // Customer info (can be a registered user or a guest)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      default: null,
    },
    name:  { type: String, required: [true, 'Customer name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },

    // Event details
    eventType:  { type: String, required: [true, 'Event type is required'] },
    date:       { type: String, required: [true, 'Event date is required'] },
    guestRange: { type: String, default: '' },

    // Venue & package
    venue:   { type: String, default: '' },
    package: { type: String, default: '' },

    // Add-on services
    addons: { type: [String], default: [] },

    // Notes
    notes:      { type: String, default: '' },
    adminNotes: { type: String, default: '' },

    // Status
    status: {
      type:    String,
      enum:    ['Pending', 'Approved', 'Confirmed', 'Rejected', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Indexes for fast lookup (email and phone used for My Bookings and Track feature)
bookingSchema.index({ email: 1 });
bookingSchema.index({ phone: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

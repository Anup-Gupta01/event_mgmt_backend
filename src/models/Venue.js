const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Venue name is required'],
      trim:     true,
    },
    slug: {
      type:   String,
      unique: true,
      lowercase: true,
    },
    capacity:    { type: Number, required: [true, 'Capacity is required'] },
    area:        { type: String, default: '' },
    description: { type: String, default: '' },
    shortDesc:   { type: String, default: '' },
    category:    {
      type:  String,
      enum:  ['Grand', 'Garden', 'Open Air', 'Corporate', 'Other'],
      default: 'Other',
    },
    features:   { type: [String], default: [] },
    amenities:  { type: [String], default: [] },
    pricePerDay:{ type: Number, default: 0 },
    images:     { type: [String], default: [] },   // Cloudinary URLs
    isActive:   { type: Boolean, default: true },
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from name
venueSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Venue', venueSchema);

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Service name is required'],
      trim:     true,
    },
    slug: {
      type:   String,
      unique: true,
      lowercase: true,
    },
    description: { type: String, default: '' },
    shortDesc:   { type: String, default: '' },
    icon:        { type: String, default: '' },    // emoji or icon class
    image:       { type: String, default: '' },    // Cloudinary URL
    features:    { type: [String], default: [] },
    priceFrom:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },     // display order
  },
  { timestamps: true }
);

// Auto-generate slug from name
serviceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);

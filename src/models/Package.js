const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Package name is required'],
      trim:     true,
    },
    subtitle:  { type: String, default: '' },
    price:     { type: Number, required: [true, 'Price is required'], min: 0 },
    priceUnit: { type: String, default: 'per event' },
    features:  { type: [String], default: [] },
    notIncluded: { type: [String], default: [] },
    accent:    { type: String, default: '#B8972A' },  // brand color for card
    popular:   { type: Boolean, default: false },
    isActive:  { type: Boolean, default: true },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);

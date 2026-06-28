const Venue = require('../models/Venue');

// GET /api/venues
exports.getVenues = async (req, res, next) => {
  try {
    const venues = await Venue.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, venues });
  } catch (error) { next(error); }
};

// GET /api/venues/:slug
exports.getVenueBySlug = async (req, res, next) => {
  try {
    const venue = await Venue.findOne({ slug: req.params.slug, isActive: true });
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.json({ success: true, venue });
  } catch (error) { next(error); }
};

// POST /api/venues  (admin)
exports.createVenue = async (req, res, next) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({ success: true, venue });
  } catch (error) { next(error); }
};

// PUT /api/venues/:id  (admin)
exports.updateVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.json({ success: true, venue });
  } catch (error) { next(error); }
};

// DELETE /api/venues/:id  (admin)
exports.deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.json({ success: true, message: 'Venue deleted' });
  } catch (error) { next(error); }
};

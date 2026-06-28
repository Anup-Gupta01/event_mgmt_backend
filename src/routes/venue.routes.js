const express   = require('express');
const router    = express.Router();
const { getVenues, getVenueBySlug, createVenue, updateVenue, deleteVenue } = require('../controllers/venue.controller');
const { protect } = require('../middleware/auth');
const adminOnly   = require('../middleware/admin');

router.get('/',        getVenues);
router.get('/:slug',   getVenueBySlug);
router.post('/',       protect, adminOnly, createVenue);
router.put('/:id',     protect, adminOnly, updateVenue);
router.delete('/:id',  protect, adminOnly, deleteVenue);

module.exports = router;

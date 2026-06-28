const express   = require('express');
const router    = express.Router();
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/package.controller');
const { protect } = require('../middleware/auth');
const adminOnly   = require('../middleware/admin');

router.get('/',        getPackages);
router.get('/:id',     getPackageById);
router.post('/',       protect, adminOnly, createPackage);
router.put('/:id',     protect, adminOnly, updatePackage);
router.delete('/:id',  protect, adminOnly, deletePackage);

module.exports = router;

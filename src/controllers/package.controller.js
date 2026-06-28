const Package = require('../models/Package');

// GET /api/packages
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, packages });
  } catch (error) { next(error); }
};

// GET /api/packages/:id
exports.getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (error) { next(error); }
};

// POST /api/packages  (admin)
exports.createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, package: pkg });
  } catch (error) { next(error); }
};

// PUT /api/packages/:id  (admin)
exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (error) { next(error); }
};

// DELETE /api/packages/:id  (admin)
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) { next(error); }
};

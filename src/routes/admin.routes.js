const express   = require('express');
const router    = express.Router();
const { getDashboardStats, getAllUsers, toggleUser, deleteUser } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const adminOnly   = require('../middleware/admin');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats',              getDashboardStats);
router.get('/users',              getAllUsers);
router.patch('/users/:id/toggle', toggleUser);
router.delete('/users/:id',       deleteUser);

module.exports = router;

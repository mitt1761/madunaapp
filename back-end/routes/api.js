const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware'); // Import middleware

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');

// Jalur Publik
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/products', productController.getProducts);
router.post('/orders', orderController.createOrder);

// Jalur Admin (Diproteksi oleh middleware isAdmin)
router.get('/admin/orders', isAdmin, adminController.getAllOrders);
router.put('/admin/orders/:id', isAdmin, adminController.updateOrderStatus);
router.get('/admin/users', isAdmin, adminController.getAllUsers);

module.exports = router;

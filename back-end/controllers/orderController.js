const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = (req, res) => {
    const { user_id, quantity } = req.body;
    
    // 1. Simpan pesanan menggunakan Order Model
    Order.create(user_id, quantity, 85000 * quantity, (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal membuat pesanan" });

        // 2. Kurangi stok menggunakan Product Model (Background Task)
        Product.updateStock(quantity, (err, updateResult) => {
            if (err) return res.status(500).json({ message: "Pesanan sukses, stok gagal update" });
            res.status(201).json({ message: "Checkout berhasil!" });
        });
    });
};
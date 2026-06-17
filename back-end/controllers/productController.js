const Product = require('../models/productModel');

exports.getProducts = (req, res) => {
    // Memanggil fungsi dari Product Model
    Product.findAll((err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data" });
        res.status(200).json(results);
    });
};
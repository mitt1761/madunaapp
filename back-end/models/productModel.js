const db = require('../config/database');

const Product = {
    // Ambil data madu
    findAll: (callback) => {
        db.query("SELECT * FROM products", callback);
    },
    // Kurangi stok saat ada pesanan
    updateStock: (quantity, callback) => {
        db.query("UPDATE products SET stock = stock - ? WHERE id = 1", [quantity], callback);
    }
};

module.exports = Product;
const db = require('../config/database');

const Order = {
    // Simpan pesanan baru
    create: (user_id, quantity, total_price, callback) => {
        const query = "INSERT INTO orders (user_id, quantity, total_price, status) VALUES (?, ?, ?, 'pending')";
        db.query(query, [user_id, quantity, total_price], callback);
    },
    // Ambil semua data pesanan (untuk Admin)
    findAll: (callback) => {
        const query = `
            SELECT orders.id, users.name, orders.quantity, orders.total_price, orders.status 
            FROM orders 
            JOIN users ON orders.user_id = users.id`;
        db.query(query, callback);
    }
};

module.exports = Order;

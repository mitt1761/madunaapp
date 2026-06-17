const db = require('../config/database');

// 1. Melihat Semua Pesanan Masuk
exports.getAllOrders = (req, res) => {
    // Mengambil data pesanan beserta nama pembelinya (JOIN tabel)
    const query = `
        SELECT orders.id, users.name, orders.quantity, orders.total_price, orders.status, orders.order_date 
        FROM orders 
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.order_date DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data pesanan" });
        res.status(200).json(results);
    });
};

// 2. Mengubah Status Pesanan (Misal: dari 'pending' menjadi 'dikirim')
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const query = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(query, [status, orderId], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal merubah status" });
        res.status(200).json({ message: `Status pesanan berhasil diubah menjadi ${status}` });
    });
};

// 3. Melihat Daftar Pengguna (User Administration)
exports.getAllUsers = (req, res) => {
    const query = "SELECT id, name, email, role, created_at FROM users";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data pengguna" });
        res.status(200).json(results);
    });
};

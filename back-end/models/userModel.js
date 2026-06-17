const db = require('../config/database');

const User = {
    // Menambah user baru saat register
    create: (name, email, password, callback) => {
        const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')";
        db.query(query, [name, email, password], callback);
    },
    // Mencari user berdasarkan email saat login
    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    }
};

module.exports = User;
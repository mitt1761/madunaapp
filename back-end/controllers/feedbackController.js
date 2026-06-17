const db = require('../config/database');

exports.submitComment = (req, res) => {
    const { name, content } = req.body;

    const query = "INSERT INTO comments (name, content) VALUES (?, ?)";
    db.query(query, [name, content], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal mengirim komentar" });
        res.status(201).json({ message: "Terima kasih atas masukannya!" });
    });
};
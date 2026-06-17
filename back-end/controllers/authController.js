const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: "Gagal memproses sandi" });
        
        // Memanggil fungsi dari User Model
        User.create(name, email, hashedPassword, (err, result) => {
            if (err) return res.status(400).json({ message: "Email sudah terdaftar!" });
            res.status(201).json({ message: "Registrasi berhasil!" });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    // Memanggil fungsi dari User Model
    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) return res.status(401).json({ message: "Password salah!" });
            
            // 1. Role disimpan di dalam Token (untuk keamanan di middleware)
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                'kunci_rahasia_maduna', 
                { expiresIn: '2h' }
            );

            // 2. Role juga dikirim ke Front-End (untuk kemudahan logika dashboard)
            res.status(200).json({ 
                message: "Login berhasil", 
                token: token, 
                role: user.role 
            });
        });
    });
};

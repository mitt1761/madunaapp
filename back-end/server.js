const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Panggil koneksi database dari folder config agar ikut menyala
require('./config/database');

//  rute /api/login dll akan dipasang di sini) ---
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server API berjalan di http://localhost:${PORT}`);
});

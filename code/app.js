const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// static express public
app.use(express.static('public'));

// SQLite database setup
const db = new sqlite3.Database('coconut_db.db');


// API endpoints
app.get('/api/coconut-selling-points', (req, res) => {
    db.all('SELECT * FROM selling_points', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/coconut-selling-points/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM selling_points WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.post('/api/coconut-selling-points', (req, res) => {
    const { latitude, longitude, address, name, mobileNumber, upi } = req.body;
    db.run(
        'INSERT INTO selling_points (latitude, longitude, address, name, mobile_number, upi) VALUES (?, ?, ?, ?, ?, ?)',
        [latitude, longitude, address, name, mobileNumber, upi],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.put('/api/coconut-selling-points/:id', (req, res) => {
    const id = req.params.id;
    const { latitude, longitude, address, name, mobileNumber, upi } = req.body;
    db.run(
        'UPDATE selling_points SET latitude = ?, longitude = ?, address = ?, name = ?, mobile_number = ?, upi = ? WHERE id = ?',
        [latitude, longitude, address, name, mobileNumber, upi, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Updated successfully' });
        }
    );
});

app.get('/api/coconut-selling-points/search', (req, res) => {
    const { latitude, longitude } = req.query;
    db.all(
        'SELECT * FROM selling_points WHERE latitude = ? AND longitude = ?',
        [latitude, longitude],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

app.get('/api/coconut-selling-points/search-by-area', (req, res) => {
    // You can implement searching by area logic here
    // Use req.query to get any parameters you need
    // Example: const area = req.query.area;
    // Implement your database query and send back the results
    res.json({ message: 'Searching by area is not implemented yet' });
});

// ... Other API endpoints for deleting points, adding reviews, waste collection, etc.


// Start the server
const PORT = process.env.PORT || 3553; // Change the port to 3553
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

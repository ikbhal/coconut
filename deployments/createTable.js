const sqlite3 = require('sqlite3').verbose();

// SQLite database setup
// create file at ../data 
// create file  ../ data, coconut_db.db
const db = new sqlite3.Database('../coconut_db.db');

// Create the selling_points table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS selling_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    address TEXT,
    name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    upi TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table created successfully');
    }
    
    db.close();
});

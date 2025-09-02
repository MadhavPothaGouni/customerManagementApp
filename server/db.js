// server/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite open error', err);
  else console.log('Connected to SQLite:', dbPath);
});

// Create tables and seed minimal data
db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON;`);

  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    city TEXT,
    state TEXT,
    pin_code TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    address_details TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
  );`);

  // seed if customers table empty
  db.get('SELECT COUNT(*) as count FROM customers', (err, row) => {
    if (!err && row && row.count === 0) {
      db.run(
        `INSERT INTO customers (first_name, last_name, phone_number, city, state, pin_code)
         VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)`,
        [
          'Alice', 'Johnson', '9000000001', 'Mumbai', 'Maharashtra', '400001',
          'Bob', 'Smith', '9000000002', 'Pune', 'Maharashtra', '411001'
        ]
      , function(err) {
        if (!err) {
          const aliceId = 1;
          const bobId = 2;
          db.run(`INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
            VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)`,
            [aliceId, '123 Marine Drive', 'Mumbai', 'Maharashtra', '400001',
             aliceId, 'Flat 2B, Palm St', 'Mumbai', 'Maharashtra', '400002']);
        }
      });
    }
  });

});

module.exports = db;

// server/controllers/customerController.js
const db = require('../db');

// Helper: build WHERE clause for search filters
function buildCustomerFilter(query) {
  const clauses = [];
  const params = [];

  if (query.name) {
    clauses.push('(first_name LIKE ? OR last_name LIKE ?)');
    const v = `%${query.name}%`;
    params.push(v, v);
  }
  if (query.city) {
    clauses.push('city LIKE ?');
    params.push(`%${query.city}%`);
  }
  if (query.state) {
    clauses.push('state LIKE ?');
    params.push(`%${query.state}%`);
  }
  if (query.pin) {
    clauses.push('pin_code LIKE ?');
    params.push(`%${query.pin}%`);
  }
  return { where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params };
}

exports.getAll = (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1'), 1);
  const limit = Math.max(parseInt(req.query.limit || '10'), 1);
  const offset = (page - 1) * limit;
  const sortBy = req.query.sortBy === 'phone' ? 'phone_number' : 'first_name';
  const sortDir = req.query.sortDir === 'desc' ? 'DESC' : 'ASC';

  const { where, params } = buildCustomerFilter(req.query);

  // Count total (for pagination)
  const countSql = `SELECT COUNT(*) as count FROM customers ${where}`;
  db.get(countSql, params, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = row.count || 0;

    const sql = `SELECT *, (
      SELECT COUNT(*) FROM addresses a WHERE a.customer_id = customers.id
    ) as address_count FROM customers ${where} ORDER BY ${sortBy} ${sortDir} LIMIT ? OFFSET ?`;
    db.all(sql, [...params, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ data: rows, total, page, limit });
    });
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Customer not found' });
    // load addresses too
    db.all('SELECT * FROM addresses WHERE customer_id = ?', [id], (err2, addrs) => {
      if (err2) return res.status(500).json({ error: err2.message });
      row.addresses = addrs || [];
      res.json({ data: row });
    });
  });
};

exports.create = (req, res) => {
  const { first_name, last_name, phone_number, city, state, pin_code } = req.body;
  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: 'first_name, last_name and phone_number are required' });
  }
  db.run(`INSERT INTO customers (first_name,last_name,phone_number,city,state,pin_code)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, phone_number, city || null, state || null, pin_code || null],
    function(err) {
      if (err) {
        const msg = err.message.includes('UNIQUE') ? 'Phone number already exists' : err.message;
        return res.status(400).json({ error: msg });
      }
      res.status(201).json({ id: this.lastID });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, phone_number, city, state, pin_code } = req.body;
  if (!first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: 'first_name, last_name and phone_number are required' });
  }
  db.run(`UPDATE customers SET first_name=?, last_name=?, phone_number=?, city=?, state=?, pin_code=? WHERE id=?`,
    [first_name, last_name, phone_number, city || null, state || null, pin_code || null, id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Customer not found' });
      res.json({ message: 'Customer updated' });
    });
};

exports.remove = (req, res) => {
  const id = req.params.id;
  // optionally check related data (orders) here before deleting
  db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  });
};

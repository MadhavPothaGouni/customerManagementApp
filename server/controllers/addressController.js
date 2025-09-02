// server/controllers/addressController.js
const db = require('../db');

exports.getByCustomer = (req, res) => {
  const customerId = req.params.customerId;
  db.all('SELECT * FROM addresses WHERE customer_id = ?', [customerId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
};

exports.create = (req, res) => {
  const customerId = req.params.customerId;
  const { address_details, city, state, pin_code } = req.body;
  if (!address_details || !city || !state || !pin_code) {
    return res.status(400).json({ error: 'address_details, city, state, pin_code required' });
  }
  db.run(`INSERT INTO addresses (customer_id,address_details,city,state,pin_code) VALUES (?, ?, ?, ?, ?)`,
    [customerId, address_details, city, state, pin_code],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
};

exports.update = (req, res) => {
  const id = req.params.addressId;
  const { address_details, city, state, pin_code } = req.body;
  if (!address_details || !city || !state || !pin_code) {
    return res.status(400).json({ error: 'address_details, city, state, pin_code required' });
  }
  db.run(`UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?`,
    [address_details, city, state, pin_code, id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Address not found' });
      res.json({ message: 'Address updated' });
    });
};

exports.remove = (req, res) => {
  const id = req.params.addressId;
  db.run('DELETE FROM addresses WHERE id=?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Address not found' });
    res.json({ message: 'Address deleted' });
  });
};

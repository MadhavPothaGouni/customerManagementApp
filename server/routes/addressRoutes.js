// server/routes/addressRoutes.js
const router = require('express').Router();
const controller = require('../controllers/addressController');

// Get all addresses of a customer / create one
router.get('/customers/:customerId/addresses', controller.getByCustomer);
router.post('/customers/:customerId/addresses', controller.create);

// update / delete by address id
router.put('/:addressId', controller.update);
router.delete('/:addressId', controller.remove);

module.exports = router;

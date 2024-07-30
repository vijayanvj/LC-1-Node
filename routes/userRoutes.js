
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { registerAdmin, login, createCustomer, deleteCustomer, updateCustomer } = require('../controllers/userController');
router.post('/register-admin', registerAdmin);

router.post('/login', login);

router.post('/customer', auth, createCustomer);

router.delete('/customer/:id', auth, deleteCustomer);

router.put('/customer/:id', auth, updateCustomer);

module.exports = router;

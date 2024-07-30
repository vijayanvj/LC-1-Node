
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ role: 'admin' });
    if (user) return res.status(400).json({ msg: 'Admin already exists' });

    user = new User({ username, password, role: 'admin' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const login = async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

      user.token = token;
      await user.save();

      res.json({ token });
    } catch (err) {
      console.error('Server error:', err.message); 
      res.status(500).json({ msg: 'Server error' });
    }
  };

const createCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, password, role: 'customer' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: 'Customer created successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteCustomer = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ msg: 'Invalid ID' });
      }
  
      const user = await User.findById(id);

      if (!user || user.role !== 'customer') {
        return res.status(404).json({ msg: 'Customer not found or not authorized' });
      }

      await User.findByIdAndDelete(id);
  
      res.json({ msg: 'Customer deleted successfully' });
    } catch (err) {
      console.error('Error deleting customer:', err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    let user = await User.findById(id);
    if (!user || user.role !== 'customer') return res.status(404).json({ msg: 'Customer not found' });

    if (username) user.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ msg: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { registerAdmin, login, createCustomer, deleteCustomer, updateCustomer };

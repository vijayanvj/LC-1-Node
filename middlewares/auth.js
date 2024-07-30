const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

module.exports = function(req, res, next) {
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); 
    req.user = decoded;
    User.findById(req.user.id).then(user => {
      if (!user || user.token !== token) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }
      next();
    });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

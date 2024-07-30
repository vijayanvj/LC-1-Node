// server.js
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const app = express();
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', require('./routes/userRoutes'));
app.listen(3200, () => {
  console.log("Server is Running 3200");
});

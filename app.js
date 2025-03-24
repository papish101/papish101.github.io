const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');

const app = express();

connectDB();

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);

module.exports = app;

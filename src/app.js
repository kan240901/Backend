const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// require all the routes here
const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.routes');

// using all the routes here
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;
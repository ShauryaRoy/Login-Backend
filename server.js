require('dotenv').config();
const express = require('express');
const connectDB = require('./db/index.database');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/User.routes')

const app = express();
const authRoutes = require('./routes/Auth.routes');

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connectDB();

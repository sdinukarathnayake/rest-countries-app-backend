const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
    origin: 'https://rest-countries-app-front-git-61db44-sdinukarathnayakes-projects.vercel.app/',
    credentials: true
}));
  
app.use(express.json());

app.use('/users', userRoutes);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });
}


module.exports = app;
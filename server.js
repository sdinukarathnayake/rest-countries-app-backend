const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173https://rest-countries-app-front-git-61db44-sdinukarathnayakes-projects.vercel.app',
    credentials: true
}));
  
app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('MongoDB connection failed:', err.message);
});
const express = require('express');
const router = express.Router();

const { register, login, logout, setFavoriteCountry, getFavoriteCountry, toggleFavoriteCountry, updateUser, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', register);

router.post('/login', login);
router.post('/logout', verifyToken, logout);

router.post("/set-favorite", verifyToken, setFavoriteCountry);
router.get("/get-favorite", verifyToken, getFavoriteCountry);

router.post("/toggle-favorite", verifyToken, toggleFavoriteCountry);

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: 'You are logged in.', user: req.user });
});

router.put('/update-profile', verifyToken, updateUser);
router.delete('/delete-profile', verifyToken, deleteUser);

module.exports = router;
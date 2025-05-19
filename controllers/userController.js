const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            registrationDate: new Date(),
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};


const setFavoriteCountry = async (req, res) => {
    const userId = req.user.id;  
    const { favoriteCountry } = req.body;

    if (!favoriteCountry) {
        return res.status(400).json({ message: "Country name is required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.favoriteCountries.indexOf(favoriteCountry);

        if (index > -1) {
            user.favoriteCountries.splice(index, 1);
        } else {
            user.favoriteCountries.push(favoriteCountry);
        }

        await user.save();

        res.status(200).json({ message: "Favorite countries updated", favoriteCountries: user.favoriteCountries });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


const getFavoriteCountry = async (req, res) => {

    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ favoriteCountries: user.favoriteCountries });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


const toggleFavoriteCountry = async (req, res) => {
    try {
        const userId = req.user.id;
        const { countryCode } = req.body;

        if (!countryCode) {
            return res.status(400).json({ message: "Country code is required." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const index = user.favoriteCountries.indexOf(countryCode);

        if (index > -1) {
            user.favoriteCountries.splice(index, 1);
        } else {
            user.favoriteCountries.push(countryCode);
        }

        await user.save();
        res.json({ message: "Favorite countries updated successfully.", favoriteCountries: user.favoriteCountries });
    } catch (error) {
        console.error("Error toggling favorite country:", error);
        res.status(500).json({ message: "Server error." });
    }
};


const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    register,
    login,
    logout,
    setFavoriteCountry,
    getFavoriteCountry,
    toggleFavoriteCountry,
    updateUser,
    deleteUser
};

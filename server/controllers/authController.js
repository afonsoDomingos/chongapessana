const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, country } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, country: country || 'Mozambique' });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, country: user.country } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // pre-save hook will hash it

        await user.save();
        res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { register, login, updateProfile };

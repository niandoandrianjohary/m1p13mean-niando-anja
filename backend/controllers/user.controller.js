const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Créer un utilisateur
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lire tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

        // 2. Vérifier le mot de passe (comparaison hashée)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

        // 3. Créer le Token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET, // À ajouter dans ton .env
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
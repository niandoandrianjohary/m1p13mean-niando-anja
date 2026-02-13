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

exports.signupBuyer = async (req, res) => {
    try {
        // 1. Récupération des données simplifiées
        const { email, password, name, address, phone } = req.body;

        // 2. Hachage du mot de passe (Sécurité)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Création de l'utilisateur selon le nouveau schéma "à plat"
        const user = new User({
            email,
            password: hashedPassword,
            name,        // Directement à la racine
            role: 'buyer',
            address,     // Directement à la racine
            phone        // Directement à la racine
        });

        // 4. Enregistrement
        await user.save();
        
        res.status(201).json({ 
            message: 'Acheteur créé avec succès !',
            userId: user._id 
        });
    } catch (error) {
        // Gestion des erreurs (ex: email déjà utilisé)
        res.status(400).json({ error: error.message });
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

        // 1. Chercher l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        // 2. Comparer le mot de passe hashé
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // 3. Générer le Token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. Réponse cohérente avec le nouveau modèle et les besoins d'Angular
        res.status(200).json({
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
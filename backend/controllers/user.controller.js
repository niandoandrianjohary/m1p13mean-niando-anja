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
        const { email, password, name, address, phone } = req.body;

        // 1. Vérification PRIORITAIRE : l'email existe-t-il déjà ?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Cet email est déjà utilisé par un autre compte.' 
            });
        }

        // 2. Hachage du mot de passe (Uniquement si l'email est libre)
        // Le "salt" de 10 est le standard pour un bon compromis sécurité/vitesse
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Création de l'utilisateur avec les données validées
        const user = new User({
            email,
            password: hashedPassword,
            name,
            role: 'buyer', // Forcé en 'buyer' pour cette route sécurisée
            address,
            phone
        });

        // 4. Enregistrement final
        await user.save();
        
        res.status(201).json({ 
            message: 'Acheteur créé avec succès !',
            userId: user._id 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la création du compte', 
            error: error.message 
        });
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
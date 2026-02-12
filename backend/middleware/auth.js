const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupérer le token du header "Authorization: Bearer <TOKEN>"
        const token = req.headers.authorization.split(' ')[1];
        
        // Vérifier le token avec la clé secrète du .env
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajouter les infos de l'utilisateur à la requête pour la suite
        req.auth = {
            userId: decodedToken.userId,
            role: decodedToken.role
        };
        
        next(); // On passe au contrôleur suivant
    } catch (error) {
        res.status(401).json({ message: 'Requête non authentifiée !' });
    }
};
module.exports = (rolesAutorises) => {
    return (req, res, next) => {
        // req.auth a été rempli par le middleware précédent
        if (!rolesAutorises.includes(req.auth.role)) {
            return res.status(403).json({ 
                message: "Accès refusé : vous n'avez pas les permissions nécessaires." 
            });
        }
        next();
    };
};
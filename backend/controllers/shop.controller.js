const Shop = require('../models/shop.model');
const User = require('../models/user.model');

// 1. CRÉER une boutique (Généralement fait par l'Admin ou via inscription spéciale)
exports.createShop = async (req, res) => {
    try {
        const newShop = new Shop({
            ...req.body,
            status: 'pending' // Par défaut, en attente de validation par l'Admin
        });
        const savedShop = await newShop.save();
        res.status(201).json(savedShop);
    } catch (error) {
        res.status(400).json({ message: "Erreur création boutique", error: error.message });
    }
};

// 2. LIRE toutes les boutiques (Pour l'acheteur ou l'admin)
exports.getAllShops = async (req, res) => {
    try {
        // .populate('ownerId', 'name email') permet de voir qui est le gérant
        const shops = await Shop.find().populate('ownerId', 'name email');
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: "Erreur récupération boutiques", error: error.message });
    }
};

// 3. LIRE une boutique spécifique par son ID
exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('ownerId', 'name email');
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 4. METTRE À JOUR une boutique (Sécurisé)
exports.updateShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });

        // SÉCURITÉ : Seul l'Admin ou le propriétaire peut modifier
        if (shop.ownerId.toString() !== req.auth.userId && req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé" });
        }

        // Empêcher un gérant de boutique de s'auto-valider (passer en 'active' tout seul)
        if (req.auth.role !== 'admin' && req.body.status) {
            delete req.body.status; 
        }

        const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedShop);
    } catch (error) {
        res.status(400).json({ message: "Erreur mise à jour", error: error.message });
    }
};

// 5. SUPPRIMER une boutique (Admin uniquement selon les bonnes pratiques)
exports.deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });

        if (req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Seul l'admin peut supprimer une boutique" });
        }

        await Shop.findByIdAndDelete(req.params.id);
        res.json({ message: "Boutique supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur suppression", error: error.message });
    }
};

// Fonction réservée à l'Admin pour valider une boutique
exports.verifyShop = async (req, res) => {
    try {
        const { id } = req.params;

        // On cherche et met à jour uniquement le statut
        const shop = await Shop.findByIdAndUpdate(
            id, 
            { status: 'active' }, 
            { new: true } // Pour renvoyer la boutique mise à jour
        );

        if (!shop) return res.status(404).json({ message: "Boutique introuvable" });

        res.json({ message: "Boutique validée avec succès !", shop });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la validation", error: error.message });
    }
};
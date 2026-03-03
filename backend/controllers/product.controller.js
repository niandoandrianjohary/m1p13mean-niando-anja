const Product = require('../models/product.model');
const Shop = require('../models/shop.model'); // Vérifiez le chemin vers votre modèle Shop

// product.controller.js
// exports.createProduct = async (req, res) => {
//     try {
//         // On prend tout ce qui vient du body (qui contient déjà le bon shopId et shopName)
//         const product = new Product(req.body); 
//         await product.save();
//         res.status(201).json(product);
//     } catch (e) { 
//         res.status(400).json({ error: e.message }); 
//     }
// };

// product.controller.js
exports.createProduct = async (req, res) => {
    try {
        // 1. Trouver le shop de l'utilisateur connecté
        const shop = await Shop.findOne({ ownerId: req.auth.userId });
        
        if (!shop) {
            return res.status(404).json({ message: "Vous n'avez pas de boutique pour créer un produit" });
        }

        // 2. Créer le produit en injectant le VRAI shopId et le shopName
        const product = new Product({ 
            ...req.body, 
            shopId: shop._id, 
            shopName: shop.name 
        });

        await product.save();
        res.status(201).json(product);
    } catch (e) { 
        res.status(400).json({ error: e.message }); 
    }
};

exports.getProductsByShop = async (req, res) => {
    const products = await Product.find({ shopId: req.params.shopId });
    res.json(products);
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('shopId', 'name');
        res.json(products);
    } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('shopId', 'name');
        res.json(product);
    } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.searchProducts = async (req, res) => {
    try {
        const { query, category } = req.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                category ? { category: { $regex: category, $options: 'i' } } : {}
            ]
        }).populate('shopId', 'name');
        res.json(products);
    } catch (e) { res.status(400).json({ error: e.message }); }
};


exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category }).populate('shopId', 'name');
        res.json(products);
    } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getProductsByConnectedShop = async (req, res) => {
    try {
        // 1. On cherche la boutique possédée par l'utilisateur connecté
        // On utilise ownerId car c'est le champ dans votre ShopSchema
        const shop = await Shop.findOne({ ownerId: req.auth.userId });

        // Si l'utilisateur n'a pas de boutique, on s'arrête là
        if (!shop) {
            return res.status(404).json({ message: "Boutique non trouvée pour cet utilisateur" });
        }

        // 2. On utilise l'ID de la boutique trouvée pour filtrer les produits
        const products = await Product.find({ shopId: shop._id });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des produits", 
            error: error.message 
        });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.status(200).json({ message: "Produit supprimé avec succès", product });
    } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.status(200).json({ message: "Produit mis à jour avec succès", product });
    } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json(categories);
    } catch (e) { res.status(400).json({ error: e.message }); }
};

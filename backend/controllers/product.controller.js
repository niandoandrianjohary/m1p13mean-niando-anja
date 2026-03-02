const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
    try {
        // Le shopId vient de req.auth (injecté par ton middleware auth)
        const product = new Product({ ...req.body, shopId: req.auth.userId });
        await product.save();
        res.status(201).json(product);
    } catch (e) { res.status(400).json({ error: e.message }); }
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
        // 1. On s'assure que l'ID est bien présent (sécurité)
        const shopId = req.auth.userId;
        
        // 2. On récupère les produits
        const products = await Product.find({ shopId });

        // 3. Code 200 explicite (Succès)
        res.status(200).json(products);
    } catch (error) {
        // 4. Code 500 pour une erreur serveur
        res.status(500).json({ message: "Erreur lors de la récupération des produits", error: error.message });
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

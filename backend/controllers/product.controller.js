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
        const products = await Product.find({ shopId: req.auth.userId });
        res.json(products);
    } catch (e) { res.status(400).json({ error: e.message }); }
};

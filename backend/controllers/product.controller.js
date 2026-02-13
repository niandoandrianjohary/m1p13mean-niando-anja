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
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Shop = require('../models/shop.model');

exports.createOrder = async (req, res) => {
    try {
        const { shopId, items, paymentMethod } = req.body;
        const buyerId = req.auth.userId; // Récupéré du token JWT

        // 1. Récupérer les infos pour la dénormalisation (buyerName et shopName)
        const buyer = await User.findById(buyerId);
        const shop = await Shop.findById(shopId);
        
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });

        let totalCentimes = 0;
        const orderItems = [];

        // 2. Vérification des produits et préparation des sous-documents
        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuffisant pour : ${product ? product.name : 'Inconnu'}` 
                });
            }

            // On prépare l'item selon orderItemSchema
            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price, // Prix figé au moment de l'achat
                quantity: item.quantity,
                image: product.image
            });

            totalCentimes += (product.price * 100) * item.quantity;
        }

        // 3. Mise à jour des stocks en parallèle
        await Promise.all(items.map(item => 
            Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
        ));

        // 4. Création de la commande conforme au nouveau schéma
        const order = new Order({
            buyerId: buyerId,
            buyerName: buyer.name,
            shopId: shop._id,
            shopName: shop.name,
            items: orderItems, // Utilisation du orderItemSchema
            totalPrice: totalCentimes / 100,
            paymentMethod: paymentMethod || 'cash',
            status: 'pending'
        });

        await order.save();
        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Commande non trouvée" });

        // Vérification : Seul le shop propriétaire ou l'admin peut modifier
        // Note : order.shopId est un ID de la collection 'Shops', pas l'ID User. 
        // Il faut vérifier si l'utilisateur connecté possède cette boutique.
        const shop = await Shop.findById(order.shopId);
        if (shop.ownerId.toString() !== req.auth.userId && req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Action non autorisée" });
        }

        order.status = status;
        await order.save();

        res.json({ message: "Statut mis à jour", order });
    } catch (error) {
        res.status(500).json({ message: "Erreur", error: error.message });
    }
};

exports.createOrderWithUserId = async (req, res) => {
    try {
        const { paymentMethod, items } = req.body;
        const totalCentimes = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const order = new Order({
            buyerId: req.auth.userId,
            shopName: items[0].shopName, // Dénormalisation pour Angular
            items: items, // Utilisation du orderItemSchema
            totalPrice: totalCentimes / 100,
            paymentMethod: paymentMethod || 'cash',
            status: 'pending'
        });

        await order.save();
        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        let filter = {};
        if (req.auth.role === 'buyer') filter = { buyerId: req.auth.userId };
        else if (req.auth.role === 'shop') {
            // Pour un shop, on cherche d'abord sa boutique
            const shop = await Shop.findOne({ ownerId: req.auth.userId });
            filter = { shopId: shop._id };
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur récupération commandes" });
    }
};

exports.getShopOrders = async (req, res) => {
    try {
        const shop = await Shop.findOne({ ownerId: req.auth.userId });
        if (!shop) return res.status(404).json({ message: "Vous n'avez pas encore de boutique." });

        const orders = await Order.find({ shopId: shop._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur récupération commandes" });
    }
};

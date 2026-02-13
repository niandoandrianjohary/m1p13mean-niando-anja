const Order = require('../models/order.model');
const Product = require('../models/product.model');

exports.createOrder = async (req, res) => {
    try {
        const { shopId, items } = req.body;
        let totalCentimes = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product || product.stock < item.qty) {
                return res.status(400).json({ 
                    message: `Stock insuffisant pour : ${product ? product.name : 'Inconnu'}` 
                });
            }

            // 1. On fige les infos pour l'historique
            item.priceAtPurchase = product.price;
            item.name = product.name;

            // 2. Calcul sécurisé (on travaille en centimes pour éviter les bugs JS)
            totalCentimes += (product.price * 100) * item.qty;
        }

        // 3. Mise à jour des stocks
        await Promise.all(items.map(item => 
            Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } })
        ));

        // 4. Enregistrement avec total converti en Euros (2 décimales)
        const order = new Order({
            shopId,
            items,
            totalPrice: totalCentimes / 100, 
            buyerId: req.auth.userId,
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
        const { status } = req.body; // ex: { "status": "completed" }

        // 1. Chercher la commande
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Commande non trouvée" });

        // 2. Vérification de sécurité : Est-ce bien le vendeur de cette commande ?
        // On compare l'ID du shop de la commande avec l'ID de l'utilisateur connecté (req.auth)
        if (order.shopId.toString() !== req.auth.userId && req.auth.role !== 'admin') {
            return res.status(403).json({ message: "Action non autorisée pour ce vendeur" });
        }

        // 3. Mise à jour du statut
        order.status = status;
        await order.save();

        res.json({ message: `Statut mis à jour : ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        let filter = {};

        // Si c'est un acheteur, on filtre par buyerId
        if (req.auth.role === 'buyer') {
            filter = { buyerId: req.auth.userId };
        } 
        // Si c'est une boutique, on filtre par shopId
        else if (req.auth.role === 'shop') {
            filter = { shopId: req.auth.userId };
        }

        // .populate() permet de récupérer les détails des produits au lieu de simples IDs
        const orders = await Order.find(filter).sort({ createdAt: -1 }); // Plus récentes en premier
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
};
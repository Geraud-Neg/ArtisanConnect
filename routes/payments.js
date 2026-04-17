const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/database');

router.post('/fedapay/init', async (req, res) => {
    try {
        const { bookingId, amount, customerEmail } = req.body;
        
        const FEDAPAY_KEY = process.env.FEDAPAY_SECRET_KEY;
        const BASE_URL = 'https://sandbox-api.fedapay.com/v1';

        // Si la clé n'est pas configurée, on utilise le mode Simulation Interne
        if (!FEDAPAY_KEY || FEDAPAY_KEY === 'sk_sandbox_XXX') {
            console.log('Mode Simulation FedaPay activé (Clé non configurée)');
            const simulatedLink = `/api/payments/fedapay/simulated-webhook?id=${bookingId}&status=approved`;
            return res.json({ success: true, url: simulatedLink });
        }

        // Vrai appel à l'API FedaPay
        const response = await axios.post(`${BASE_URL}/transactions`, {
            description: `Escrow pour réservation ${bookingId}`,
            amount: amount,
            currency: { iso: 'XOF' },
            callback_url: `http://localhost:${process.env.PORT || 3000}/api/payments/fedapay/webhook?bookingId=${bookingId}`,
            customer: {
                email: customerEmail || 'client@artisan.com'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${FEDAPAY_KEY}`
            }
        });

        // FedaPay renvoie un token ou directement l'URL
        const token = response.data.v1_transaction.token;
        const paymentUrl = `https://sandbox.fedapay.com/pay/${token}`;
        
        res.json({ success: true, url: paymentUrl });

    } catch (error) {
        console.error("Erreur FedaPay Init :", error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Erreur génération de paiement' });
    }
});

// Vrai Webhook FedaPay
router.get('/fedapay/webhook', async (req, res) => {
    try {
        const { id, status, bookingId } = req.query; // FedaPay callback parameters
        
        if (status === 'approved') {
            await db.execute('UPDATE bookings SET status = "paid" WHERE id = ?', [bookingId]);
        }
        res.redirect('/dashboard-client.html?payment=success');
    } catch(err) {
        res.status(500).send('Erreur Serveur');
    }
});

// Webhook Simulé
router.get('/fedapay/simulated-webhook', async (req, res) => {
    try {
        const { id, status } = req.query;
        if (status === 'approved') {
            await db.execute('UPDATE bookings SET status = "paid" WHERE id = ?', [id]);
        }
        // Redirection vers le dashboard après paiement Escrow simulé
        res.redirect('/dashboard-client.html?payment=success');
    } catch(err) {
        res.status(500).send('Erreur Serveur');
    }
});

module.exports = router;

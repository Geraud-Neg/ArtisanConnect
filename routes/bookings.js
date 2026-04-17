const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Récupérer toutes les réservations
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json({ success: true, bookings: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération.' });
    }
});

// Créer une réservation
router.post('/', async (req, res) => {
    try {
        const { client_id, artisan_id, service, amount } = req.body;
        const id = 'BOK-' + Date.now();
        
        await db.execute(
            'INSERT INTO bookings (id, client_id, artisan_id, service, amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, client_id, artisan_id, service, amount || 0, 'pending']
        );
        
        const [newBooking] = await db.execute('SELECT * FROM bookings WHERE id = ?', [id]);
        
        res.json({ success: true, booking: newBooking[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la création.' });
    }
});

// Mettre à jour le statut
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        
        await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        
        res.json({ success: true, message: `Statut mis à jour vers ${status}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur de mise à jour.' });
    }
});

module.exports = router;

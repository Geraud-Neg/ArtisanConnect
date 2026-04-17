const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [rows] = await db.execute('SELECT * FROM users WHERE phone = ? LIMIT 1', [email]);
        
        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }
        
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }
        
        // Simulating JWT format required by frontend prototype
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.phone, // Frontend used email instead of phone
                role: user.role,
                token: 'jwt_' + Buffer.from(user.phone + ':' + Date.now()).toString('base64')
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const [existing] = await db.execute('SELECT id FROM users WHERE phone = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Cet email/téléphone est déjà utilisé.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'client']
        );
        
        res.json({
            success: true,
            user: {
                id: result.insertId,
                name,
                email,
                role: role || 'client',
                token: 'jwt_' + Buffer.from(email + ':' + Date.now()).toString('base64')
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

module.exports = router;

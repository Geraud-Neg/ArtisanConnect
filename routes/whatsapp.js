const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/database');

// Réception des messages via Webhook Meta WhatsApp Cloud API
router.post('/webhook', async (req, res) => {
    try {
        let body = req.body;
        
        // Vérification si c'est bien un message entrant
        if (body.object) {
            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from; // Numéro de l'expéditeur
                const msg_body = body.entry[0].changes[0].value.messages[0].text.body.toLowerCase().trim();

                console.log(`[WhatsApp] Message reçu de ${from} : ${msg_body}`);

                // Vérifier à qui correspond ce numéro
                const [users] = await db.execute('SELECT * FROM users WHERE phone = ?', [from]);
                
                if (users.length > 0) {
                    const user = users[0];
                    // Si c'est un artisan qui répond "oui"
                    if (user.role === 'artisan' && (msg_body === 'oui' || msg_body === 'ok')) {
                        // Trouver sa réservation en attente (logique simple)
                        const [bookings] = await db.execute('SELECT * FROM bookings WHERE artisan_id = ? AND status = "pending" LIMIT 1', [user.id]);
                        if(bookings.length > 0) {
                            await db.execute('UPDATE bookings SET status = "confirmed" WHERE id = ?', [bookings[0].id]);
                            await sendWhatsAppMessage(from, `✅ Vous avez accepté la mission. Un lien de paiement a été envoyé au client.`);
                        }
                    } 
                    // Si c'est un client qui valide (ex: code 1234)
                    else if (user.role === 'client' && msg_body === '1234') {
                        const [bookings] = await db.execute('SELECT * FROM bookings WHERE client_id = ? AND status = "completed_by_artisan" LIMIT 1', [user.id]);
                        if (bookings.length > 0) {
                            await db.execute('UPDATE bookings SET status = "completed" WHERE id = ?', [bookings[0].id]);
                            await sendWhatsAppMessage(from, `✅ Code correct. L'argent sous séquestre a été transféré à l'artisan !`);
                        }
                    }
                }
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Vérification du webhook lors de la configuration Meta App
router.get('/webhook', (req, res) => {
    const verify_token = process.env.WHATSAPP_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Fonction utilitaire pour envoyer un vrai message WhatsApp API
async function sendWhatsAppMessage(to, text) {
    const token = process.env.WHATSAPP_API_TOKEN || "test_token";
    if (token === "test_token") {
        console.log(`[Simulation WhatsApp Backend Envoi] Vers ${to} : ${text}`);
        return;
    }
    
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
            data: {
                messaging_product: "whatsapp",
                to: to,
                text: { body: text }
            },
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch(err) {
        console.error("Erreur d'envoi WhatsApp API : ", err.response?.data || err.message);
    }
}

// Endpoint pour déclencher un message depuis le Front
router.post('/send', async (req, res) => {
    const { to, text } = req.body;
    await sendWhatsAppMessage(to, text);
    res.json({ success: true, message: 'Message envoyé (ou simulé)' });
});

module.exports = router;

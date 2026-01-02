const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.static('.')); // Serve frontend files
app.use(express.json());
app.use(cors());

// --- ZOOM API HELPERS ---
async function getZoomAccessToken() {
    // Requires Server-to-Server OAuth App credentials
    const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`, {}, {
        headers: { Authorization: `Basic ${auth}` }
    });
    return response.data.access_token;
}

async function assignZoomLicense(email) {
    try {
        const token = await getZoomAccessToken();
        // Upgrade user to 'Licensed' (type 2)
        await axios.patch(`https://api.zoom.us/v2/users/${email}`, {
            type: 2
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Zoom license assigned to ${email}`);
    } catch (error) {
        console.error('Zoom API Error:', error.response ? error.response.data : error.message);
    }
}

// --- STRIPE ENDPOINTS ---

app.post('/api/create-checkout-session', async (req, res) => {
    const { items, customerEmail, zoomAccountEmail } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/success.html`,
            cancel_url: `${process.env.BASE_URL}/products.html`,
            metadata: {
                zoomAccountEmail: zoomAccountEmail || ''
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- STRIPE WEBHOOK ---
// Requires local testing with Stripe CLI: stripe listen --forward-to localhost:3000/api/webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const zoomEmail = session.metadata.zoomAccountEmail;

        if (zoomEmail) {
            await assignZoomLicense(zoomEmail);
        }
    }

    res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

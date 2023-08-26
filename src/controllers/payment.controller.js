import Stripe from 'stripe'
import config from '../config/config.js'
const stripe = new Stripe(config.stripe.secretKey)

export const createSession = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: 'Laptop',
                        description: 'Gamming Laptop'
                    },
                    currency: 'usd',
                    unit_amount: 200000 // USD 2000.00
                },
                quantity: 1
            },
            {
                price_data: {
                    product_data: {
                        name: 'TV',
                        description: 'Smart TV'
                    },
                    currency: 'usd',
                    unit_amount: 300000 // USD 3000.00
                },
                quantity: 2
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:8080/api/success',
        cancel_url: 'http://localhost:8080/api/cancel'
    })
    return res.json(session)
}
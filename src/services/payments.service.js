import Stripe from "stripe";
import config from "../config/config.js";

const stripe = new Stripe(config.stripe.secretKey);

export default class PaymentsService {
    constructor() {
        this.stripe = stripe
    }

    createPaymentIntent = async (data) => {
        const paymentIntent = await this.stripe.paymentIntents.create(data);
        return paymentIntent;
    }
}
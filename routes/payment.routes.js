import express from "express";
import { checkout } from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API for managing payments
 */

/**
 * @swagger
 * /api/payment/checkout:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [stripe, paypal, vnpay, momo]
 *                 description: The payment method to use.
 *                 example: stripe
 *               orderId:
 *                 type: string
 *                 description: The order ID for the payment.
 *                 example: "12345"
 *               amount:
 *                 type: number
 *                 description: The total amount for the payment.
 *                 example: 500000
 *               currency:
 *                 type: string
 *                 description: The currency of the payment.
 *                 example: "VND"
 *               paymentMethodId:
 *                 type: string
 *                 description: Required for Stripe payments.
 *                 example: "pm_card_visa"
 *               returnUrl:
 *                 type: string
 *                 description: Required for VNPay and Momo payments.
 *                 example: "https://your-website.com/payment-success"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/payment/checkout", checkout);

export default router;

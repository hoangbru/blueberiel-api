import express from "express";
import {
  create,
  list,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import { authenticate, protect } from "../middleware/protect.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               shippingAddress:
 *                 type: string
 *               deliveryMethod:
 *                 type: string
 *                 enum: ["standard", "express"]
 *               paymentMethod:
 *                 type: string
 *                 enum: ["cash_on_delivery", "card"]
 *               orderComment:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/orders", authenticate, create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       500:
 *         description: Server error
 */
router.get("/orders", authenticate, list);

/**
 * @swagger
 * /api/order/{orderId}/status:
 *   put:
 *     summary: Update the payment status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/order/:orderId/status", authenticate, updateOrderStatus);

/**
 * @swagger
 * /api/order/{orderId}/cancel:
 *   put:
 *     summary: Cancel an order (only if it's pending)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       404:
 *         description: Order not found or cannot be cancelled
 *       500:
 *         description: Server error
 */
router.put("/order/:orderId/cancel", authenticate, cancelOrder);

export default router;

import { v4 as uuidv4 } from "uuid";

import Order from "../models/order.model.js";
import { orderValidationSchema } from "../schemas/order.js";

/**
 * @desc Create a new order
 * @route POST /api/orders
 * @access private
 */
export const create = async (req, res) => {
  const {
    fullName,
    phone,
    items,
    shippingAddress,
    deliveryMethod,
    paymentMethod,
    orderComment,
  } = req.body;

  try {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        meta: { message: "Invalid items data" },
      });
    }

    let totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (deliveryMethod === "express") {
      totalAmount += 2;
    }

    const { error } = orderValidationSchema.validate(
      {
        userId: req.user.id,
        fullName,
        phone,
        items,
        shippingAddress,
        deliveryMethod,
        paymentMethod,
        orderComment,
        totalAmount,
      },
      { abortEarly: false }
    );
    if (error) {
      return res.status(400).json({
        meta: {
          message: "Validation errors",
          errors: error.details.map((err) => err.message),
        },
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      fullName,
      phone,
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      orderComment,
      totalAmount,
    });

    res.status(201).json({
      meta: { message: "Order created successfully" },
      data: { order },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      meta: {
        message: "Error creating order",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Get orders for a user
 * @route GET /api/orders
 * @access private
 */
export const list = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      meta: { message: "Orders retrieved successfully" },
      data: { orders },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      meta: {
        message: "Error fetching orders",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Update order payment status
 * @route PUT /api/order/:orderId/status
 * @access private
 */
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  if (
    !["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(
      paymentStatus
    )
  ) {
    return res.status(400).json({
      meta: { message: "Invalid payment status", errors: true },
    });
  }

  try {
    const updateData = { paymentStatus };

    if (paymentStatus === "shipped") {
      updateData.trackingNumber = `BBR-${uuidv4().slice(0, 8).toUpperCase()}`;
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        meta: { message: "Order not found", errors: true },
      });
    }

    res.status(200).json({
      meta: { message: "Payment status updated successfully" },
      data: { order },
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      meta: {
        message: "Error updating payment status",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Cancel an order
 * @route PUT /api/orders/:orderId/cancel
 * @access private
 */
export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId: req.user.id, paymentStatus: "pending" },
      { paymentStatus: "cancelled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        meta: {
          message: "Order not found or cannot be cancelled",
          errors: true,
        },
      });
    }

    res.status(200).json({
      meta: { message: "Order cancelled successfully" },
      data: { order },
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      meta: {
        message: "Error cancelling order",
        errors: error.message || error,
      },
    });
  }
};

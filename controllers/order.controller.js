import { Order } from "../models/orderModel.js";
import { orderValidationSchema } from "../schemas/order.js";

/**
 * @desc Create a new order
 * @route POST /api/orders
 * @access private
 */
export const create = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      meta: { message: "Unauthorized user", errors: true },
    });
  }

  try {
    const { error } = orderValidationSchema.validate(
      { user: req.user.id, items, shippingAddress, paymentMethod, totalAmount },
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
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
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
    const orders = await Order.find({ user: req.user.id }).sort({
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
 * @route PUT /api/orders/:orderId/status
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
    const order = await Order.findOneAndUpdate(
      { id: orderId, user: req.user.id },
      { paymentStatus },
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
      { id: orderId, user: req.user.id, paymentStatus: "pending" },
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

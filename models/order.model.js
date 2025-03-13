import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    phone: { type: String, match: /^\+?[1-9]\d{1,14}$/ },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
      },
    ],
    shippingAddress: { type: String, required: true },
    deliveryMethod: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card"],
      default: "cash_on_delivery",
    },
    orderComment: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

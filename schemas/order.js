import Joi from "joi";
import mongoose from "mongoose";

export const orderValidationSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message(`"userId" must be a valid ObjectId`);
      }
      return value;
    })
    .required()
    .messages({
      "any.required": `"userId" is a required field`,
    }),

  fullName: Joi.string().trim().min(3).max(100).messages({
    "string.base": `"fullName" should be a string`,
    "string.min": `"fullName" should be at least 3 characters long`,
    "string.max": `"fullName" should not exceed 100 characters`,
  }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      "string.pattern.base": `"phone" must be a valid international phone number`,
    }),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              return helpers.message(`"productId" must be a valid ObjectId`);
            }
            return value;
          })
          .required()
          .messages({
            "any.required": `"productId" is a required field`,
          }),

        name: Joi.string().min(1).max(255).required().messages({
          "string.base": `"name" should be a string`,
          "string.min": `"name" should have at least 1 character`,
          "string.max": `"name" should have at most 255 characters`,
          "any.required": `"name" is a required field`,
        }),

        price: Joi.number().min(0).required().messages({
          "number.base": `"price" should be a number`,
          "number.min": `"price" should be at least 0`,
          "any.required": `"price" is a required field`,
        }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": `"quantity" should be a number`,
          "number.integer": `"quantity" should be an integer`,
          "number.min": `"quantity" should be at least 1`,
          "any.required": `"quantity" is a required field`,
        }),

        size: Joi.string().min(1).max(50).required().messages({
          "string.base": `"size" should be a string`,
          "string.min": `"size" should have at least 1 character`,
          "string.max": `"size" should have at most 50 characters`,
          "any.required": `"size" is a required field`,
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": `"items" should be an array`,
      "array.min": `"items" should have at least one item`,
      "any.required": `"items" is a required field`,
    }),
    
  shippingAddress: Joi.string().required().messages({
    "string.base": `"shippingAddress" should be a string`,
    "string.empty": `"shippingAddress" cannot be an empty field`,
    "any.required": `"shippingAddress" is a required field`,
  }),

  deliveryMethod: Joi.string()
    .valid("standard", "express")
    .default("standard")
    .messages({
      "any.only": `"deliveryMethod" must be one of ["standard", "express"]`,
    }),

  paymentMethod: Joi.string()
    .valid("cash_on_delivery", "card")
    .default("cash_on_delivery")
    .messages({
      "any.only": `"paymentMethod" must be one of ["cash_on_delivery", "card"]`,
    }),

  orderComment: Joi.string().trim().min(3).max(500).messages({
    "string.base": `"orderComment" should be a string`,
    "string.min": `"orderComment" should be at least 3 characters long`,
    "string.max": `"orderComment" should not exceed 500 characters`,
  }),

  totalAmount: Joi.number().positive().required().messages({
    "number.base": `"totalAmount" should be a number`,
    "number.positive": `"totalAmount" should be a positive number`,
    "any.required": `"totalAmount" is a required field`,
  }),

  paymentStatus: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .default("pending")
    .messages({
      "any.only": `"paymentStatus" must be one of ["pending", "confirmed", "shipped", "delivered", "cancelled"]`,
    }),
});

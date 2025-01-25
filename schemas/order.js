import Joi from "joi";

export const orderValidationSchema = Joi.object({
  user: Joi.string().required().messages({
    "string.base": `"user" should be a valid string`,
    "string.empty": `"user" cannot be an empty field`,
    "any.required": `"user" is a required field`,
  }),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required().messages({
          "string.base": `"product" should be a valid string`,
          "string.empty": `"product" cannot be an empty field`,
          "any.required": `"product" is a required field`,
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": `"quantity" should be a number`,
          "number.integer": `"quantity" should be an integer`,
          "number.min": `"quantity" should be at least 1`,
          "any.required": `"quantity" is a required field`,
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
  totalAmount: Joi.number().positive().required().messages({
    "number.base": `"totalAmount" should be a number`,
    "number.positive": `"totalAmount" should be a positive number`,
    "any.required": `"totalAmount" is a required field`,
  }),
  shippingAddress: Joi.string().required().messages({
    "string.base": `"shippingAddress" should be a string`,
    "string.empty": `"shippingAddress" cannot be an empty field`,
    "any.required": `"shippingAddress" is a required field`,
  }),
  paymentMethod: Joi.string()
    .valid("cash_on_delivery", "online")
    .default("cash_on_delivery")
    .messages({
      "string.base": `"paymentMethod" should be a string`,
      "any.only": `"paymentMethod" must be one of ["cash_on_delivery", "online"]`,
    }),
  paymentStatus: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .default("pending")
    .messages({
      "string.base": `"paymentStatus" should be a string`,
      "any.only": `"paymentStatus" must be one of ["pending", "confirmed", "shipped", "delivered", "cancelled"]`,
    }),
});

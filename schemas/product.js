import Joi from "joi";

export const productValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is a required field.",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is a required field.",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price must be greater than or equal to 0.",
    "any.required": "Price is required.",
  }),

  stock: Joi.number().min(0).required().messages({
    "number.base": "Stock must be a number.",
    "number.min": "Stock must be greater than or equal to 0.",
    "any.required": "Stock is required.",
  }),

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid MongoDB ObjectId.",
      "any.required": "Category is required.",
    }),

  images: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Images must be an array.",
    "string.uri": "Each image must be a valid URL.",
  }),

  slug: Joi.string().trim().alphanum().messages({
    "string.alphanum": "Slug must only contain alphanumeric characters.",
  }),
});

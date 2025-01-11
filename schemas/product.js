import Joi from "joi";

export const productValidationSchema = Joi.object({
  // Name validation
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is a required field.",
  }),

  // Description validation
  description: Joi.string().trim().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is a required field.",
  }),

  // Price validation
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price must be greater than or equal to 0.",
    "any.required": "Price is required.",
  }),

  // Stock validation
  stock: Joi.number().min(0).default(0).messages({
    "number.base": "Stock must be a number.",
    "number.min": "Stock must be greater than or equal to 0.",
  }),

  // Category validation
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Category must be a valid MongoDB ObjectId.",
      "any.required": "Category is required.",
    }),

  // Images validation
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URL.",
      })
    )
    .default([])
    .messages({
      "array.base": "Images must be an array.",
    }),

  // Rating validation
  rating: Joi.object({
    average: Joi.number().min(0).max(5).default(0).messages({
      "number.base": "Average rating must be a number.",
      "number.min": "Average rating must be at least 0.",
      "number.max": "Average rating must be at most 5.",
    }),
    count: Joi.number().min(0).default(0).messages({
      "number.base": "Rating count must be a number.",
      "number.min": "Rating count must be at least 0.",
    }),
  }).default({
    average: 0,
    count: 0,
  }),

  // Variants validation
  variants: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().trim().required().messages({
          "string.empty": "Size is required.",
        }),
        color: Joi.string().trim().required().messages({
          "string.empty": "Color is required.",
        }),
        stock: Joi.number().min(0).default(0).messages({
          "number.base": "Stock must be a number.",
          "number.min": "Stock must be greater than or equal to 0.",
        }),
      })
    )
    .messages({
      "array.base": "Variants must be an array.",
    }),
});

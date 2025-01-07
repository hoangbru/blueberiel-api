import Joi from "joi";

export const productValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  price: Joi.number().required(),
  description: Joi.string().required().min(10),
  stock: Joi.number().required(),
});

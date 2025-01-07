import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";

const plugins = [slug, mongoosePaginate];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ type: String }],
    slug: { type: String, slug: "name", unique: true },
  },
  { timestamps: true, versionKey: false }
);

plugins.forEach((plugin) => {
  productSchema.plugin(plugin, {
    overrideMethods: true,
  });
});

const Product = mongoose.model("Product", productSchema);
export default Product;

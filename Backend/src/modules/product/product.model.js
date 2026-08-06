import mongoose from "mongoose";
import slugify from "slugify";

const imageSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    Mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    SellingPrice: {
      type: Number,
      default: 10,
      required:true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: {
      type: [imageSchema],
      validate: {
        validator: (images) => images.length >= 1 && images.length <= 6,
        message: "Product must have between 1 and 6 images",
      },
    },

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],

    directions: {
      type: String,
      default: "",
    },

    warnings: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


productSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});


const Product = mongoose.model("Product", productSchema);

export default Product;
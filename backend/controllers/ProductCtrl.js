import Product from "../model/Product.js";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";
import { calculateAndUpdateSalesPrice } from "../utils/offerHelper.js";

export const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      sizes,
      color,
      price,
      totalQty,
    } = req.body;

    const productExists = await Product.findOne({ name });

    if (productExists) {
      throw new Error("product already exists");
    }
    //create product
    const convertedImages = req.files.map((file) => file.path);

    //find the brand
    const brandFound = await Brand.findOne({
      name: brand,
    });

    if (!brandFound) {
      throw new Error(
        "Brand not found, please create brand first or check brand name"
      );
    }
    //find the category
    const categoryFound = await Category.findOne({
      name: category,
    });
    if (!categoryFound) {
      throw new Error(
        "Category not found, please create category first or check category name"
      );
    }
    const product = await Product.create({
      name,
      description,
      brand,
      category,
      sizes,
      color,
      price,
      totalQty,
      user: req.userAuthId,
      images: convertedImages,
    });
    //push the product into category
    categoryFound.products.push(product._id);
    //resave
    await categoryFound.save();
    //push the product into brand
    brandFound.products.push(product._id);
    //resave
    await brandFound.save();

    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  let productQuery = Product.find();

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: new RegExp(`^${req.query.category}$`, "i"), // Exact match
    });
  }

  //filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      color: { $regex: req.query.color, $options: "i" },
    });
  }

  //filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }
  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // Sorting
  if (req.query.sort) {
    let sortOption = {};

    switch (req.query.sort) {
      case "price_asc":
        sortOption = { price: 1 }; // Ascending price
        break;
      case "price_desc":
        sortOption = { price: -1 }; // Descending price
        break;
      case "rating_desc":
        sortOption = { rating: -1 }; // Highest rated first
        break;
      case "popularity":
        sortOption = { sold: -1 }; // Most sold first
        break;
      case "newest":
        sortOption = { createdAt: -1 }; // Newest first
        break;
      default:
        sortOption = { popularity: -1 }; // Default to popularity
    }

    productQuery = productQuery.sort(sortOption);
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 8;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate("reviews");

  // Update `salesPrice` for each product with an offer
  //  for (const product of products) {

  //   const updatedSalesPrice = await calculateAndUpdateSalesPrice(product._id);

  //   product.salesPrice = updatedSalesPrice;
  // }
  await Promise.all(
    products.map(async (product) => {
      product.salesPrice = await calculateAndUpdateSalesPrice(product._id);
    })
  );
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});
export const singleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "user", select: "name" },
  });
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    color,
    user,
    price,
    totalQty,
    brand,
    removedImages = [], // Get removed images array from frontend
  } = req.body;

  // Find the existing product to preserve old images if none are uploaded
  const existingProduct = await Product.findById(req.params.id);
  // Remove images that the user deleted
  let updatedImages = existingProduct.images.filter(
    (img) => !removedImages.includes(img) // Keep only images not in removedImages
  );
  if (req.files) {
    const imagePaths = req.files.map((file) => file.path); // Save file paths
    updatedImages = [...updatedImages, ...imagePaths]; // Append new images
  }
  let updatedFields = {
    name,
    description,
    category,
    sizes,
    color,
    user,
    price,
    totalQty,
    brand,
    images: updatedImages,
  };

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

export const listUnListProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    product.status = !product.status;
    await product.save();

    res
      .status(200)
      .json({
        message: `Product ${
          product.status ? "Blocked" : "Unblocked"
        } successfully`,
        product,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

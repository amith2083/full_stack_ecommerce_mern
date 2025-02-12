import Product from "../model/Product.js";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

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
    console.log("Request Body:", req.body);
    console.log("Uploaded files:", req.files);
    console.log(req.body.brand);
    const productExists = await Product.findOne({ name });

    if (productExists) {
      throw new Error("product already exists");
    }
    //create product
    const convertedImages = req.files.map((file) => file.path);
    console.log(convertedImages);
    //find the brand
    const brandFound = await Brand.findOne({
      name:brand,
    });
    console.log(brandFound);

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

// export const getProducts = asyncHandler(async (req, res) => {
//   let products = await Product.find();

//   //search by name
//   if (req.query.name) {
//     products = await Product.find({
//       name: { $regex: req.query.name, $options: "i" },
//     });
//   }
//   //filtering
//   if (req.query.brand) {
//     products = await Product.find({
//       brand: { $regex: req.query.brand, $options: "i" },
//     });
//   }
//   if (req.query.category) {
//     products = await Product.find({
//       category: { $regex: req.query.category, $options: "i" },
//     });
//   }
//   if (req.query.color) {
//     products = await Product.find({
//       color: { $regex: req.query.color, $options: "i" },
//     });
//   }
//   if (req.query.sizes) {
//     products = await Product.find({
//       sizes: { $regex: req.query.sizes, $options: "i" },
//     });
//   }
//   //filter by price range
//   if (req.query.price) {
//     const priceRange = await req.query.price.split("-");
//     console.log(priceRange);
//     products = await Product.find({
//       normalPrice: { $gte: priceRange[0], $lte: priceRange[1] },
//     });
//   }
//   //pagination
//   const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
//   const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//   const total = await Product.countDocuments();
//   const pagination = {};
//   if (endIndex < total) {
//     //it means there's a next page available.
//     pagination.next = {
//       page: page + 1,
//       limit,
//     };
//   }
//   if (startIndex > 0) {
//     //it means there's a previous page available.
//     pagination.prev = {
//       page: page - 1,
//       limit,
//     };
//   }
//   products = await Product.find().populate('reviews').skip(startIndex).limit(limit);

//   if (products) {
//     res.json({
//       status: "success",
//       total,
//       pagination,
//       results: products.length,
//       msg: "products fetched",
//       products,
//     });
//   }
// });

export const getProducts = asyncHandler(async (req, res) => {
  console.log(req.query);
  //query
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
      category: { $regex: req.query.category, $options: "i" },
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
  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
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
  const product = await Product.findById(req.params.id).populate('reviews');
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
    normalPrice,
    totalQty,
    brand,
  } = req.body;
  //validation

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      color,
      user,
      normalPrice,
      totalQty,
      brand,
    },
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

export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});


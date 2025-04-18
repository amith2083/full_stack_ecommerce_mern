import asyncHandler from "express-async-handler";

import Product from "../model/Product.js";
import Category from "../model/Category.js";


import Offer from "../model/Offer.js";
import mongoose from "mongoose";

// export const getAllOffers = asyncHandler(async (req, res) => {

//   const products = await Product.find();
//   const categories = await Category.find();
  
//   const offers = await Offer.find()
//     .populate("applicableToProduct applicableToCategory")
//     .sort({ createdAt: -1 });

//   console.log(offers);

//   // const categories = await Category.find()
//   return res.render("addOffer", { admin, products, categories, offers });
// });
export const getAllOffers = asyncHandler(async (req, res) => {
  const offers= await Offer.find().populate({
    path: "applicableToProduct",
    select: "_id name"
  })
  .populate({
    path: "applicableToCategory",
    select: "_id name"
  });
  res.status(200).json({
    status: "success",
    message: "All offers",
    offers,
  });
});

export const getOffer = asyncHandler(async (req, res) => {
 
  const offer = await Offer.findOne({ code: req.query.code });
  //check if is not found
 
  if (offer === null) {
    throw new Error("offer not found");
  }
 
  res.json({
    status: "success",
    message: "offer fetched",
    offer,
  });
});

export const createOffer = asyncHandler(async (req, res) => {
  try {
    const {
      code,
      offerType,
      offerValue,
      startDate,
      endDate,
      description,
      applicableTo,
      applicableToProduct,
      applicableToCategory,
      usageLimit,
    } = req.body;
//     console.log('.........',req.body)


//     console.log(typeof applicableToProduct); 
// console.log(typeof applicableToCategory);

// console.log(mongoose.Types.ObjectId.isValid(applicableToProduct)); // Expected: true
// console.log(mongoose.Types.ObjectId.isValid(applicableToCategory))

    // Validate inputs
    if (
      !code ||
      !offerType ||
      !offerValue ||
      !startDate ||
      !endDate ||
      !applicableTo ||
      !usageLimit
    ) {
      return res.status(400).json({
        status: "error",
        message: "All required fields must be filled",
      });
    }
    const upperCaseCode = code.toUpperCase();
    // Create a new offer
    const newOffer = new Offer({
      code: upperCaseCode,
      offerType,
      offerValue,
      // minPurchaseAmount: minPurchaseAmount || 0,
      // maxDiscountAmount: maxDiscountAmount || 0,
      startDate,
      endDate,
      description: description || "",
      applicableTo,
      applicableToProduct:
        applicableTo === "Product" ? applicableToProduct : null,
      applicableToCategory:
        applicableTo === "Category" ? applicableToCategory : null,
      usageLimit: usageLimit || 0,
      status: "active", // or any default status
    });

    // Save the offer in the database
    const savedOffer = await newOffer.save();

    // }
    // Apply offer to a specific product or category
    if (applicableTo === "Product" && applicableToProduct) {
      const product = await Product.findByIdAndUpdate(applicableToProduct, {
        $addToSet: { offers: savedOffer._id },
      });

      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      }

      // Update the sales price for the specific product
      // await product.updateSalesPriceWithOffers();
    } else if (applicableTo === "Category" && applicableToCategory) {
      const categoryExists = await Category.findById(applicableToCategory);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
    }
      // Apply offer to all products in the category
      const products = await Product.updateMany(
        { category:  categoryExists.name },
        { $addToSet: { offers: savedOffer._id } }
      );

    
    }

    res.status(201).json({
      status: "success",
      message: "Offer created successfully",
      offer: savedOffer,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ status: "error", message: messages.join(", ") });
    } else if (error.code === 11000) {
      // Handle duplicate code error
      return res
        .status(400)
        .json({ status: "error", message: "Offer code already exists" });
    } else if (error.message) {
      // Handle validation errors from the `pre('save')` hook
      return res.status(400).json({ status: "error", message: error.message });
    } else {
      console.error("Error creating offer:", error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }
});


export const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  
  const {
    code,
    offerType,
    offerValue,
    startDate,
    endDate,
    description,
  } = req.body;
 

 

  const offer = await Offer.findById(new mongoose.Types.ObjectId(id));
  console.log(offer)
  if (!offer) {
    return res.status(404).json({
      status: "error",
      message: "Offer not found",
    });
  }


  const upperCaseCode = code.toUpperCase();

  // Check for duplicate code (if changed)
  if (offer.code !== upperCaseCode) {
    const existing = await Offer.findOne({ code: upperCaseCode });
    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Offer code already exists",
      });
    }
  }

  // Update offer fields
  offer.code = upperCaseCode;
  // offer.offerType = offerType;
  offer.offerValue = offerValue;
  offer.startDate = startDate;
  offer.endDate = endDate;
  offer.description = description || "";
  // offer.applicableTo = applicableTo;
  // offer.applicableToProduct =
  //   applicableTo === "Product" ? applicableToProduct : null;
  // offer.applicableToCategory =
  //   applicableTo === "Category" ? applicableToCategory : null;
  // offer.usageLimit = usageLimit;

  const updatedOffer = await offer.save();

  // Clear offer from all products (clean-up before reapplying)
  // await Product.updateMany(
  //   { offers: offer._id },
  //   { $pull: { offers: offer._id } }
  // );

  // // Re-apply the offer to selected target
  // if (applicableTo === "Product" && applicableToProduct) {
  //   const product = await Product.findByIdAndUpdate(applicableToProduct, {
  //     $addToSet: { offers: offer._id },
  //   });
  //   if (!product) {
  //     return res.status(404).json({ message: "Product not found" });
  //   }
  // } else if (applicableTo === "Category" && applicableToCategory) {
  //   const category = await Category.findById(applicableToCategory);
  //   if (!category) {
  //     return res.status(404).json({ message: "Category not found" });
  //   }

  //   await Product.updateMany(
  //     { category: category.name },
  //     { $addToSet: { offers: offer._id } }
  //   );
  // }

  res.status(200).json({
    status: "success",
    message: "Offer updated successfully",
    offer: updatedOffer,
  });
});


export const listUnListOffer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "offer not found" });
    }

    offer.isBlocked = !offer.isBlocked;
    await offer.save();

    res
      .status(200)
      .json({
        message: `Offer${
          offer.isBlocked ? "Blocked" : "Unblocked"
        } successfully`,
        offer,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
})

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
      // Apply offer to all products in the category
      const products = await Product.updateMany(
        { category: applicableToCategory },
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

export const blockOffer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await Offer.findByIdAndUpdate(id, { status: "inactive" }, { new: true });

    // res.redirect('/admin/add-offer-product'); // Redirect to the offer list page
    return res
      .status(200)
      .json({ success: true, message: "Offer blocked successfully" });
  } catch (error) {
    console.error("Error blocking offer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export const unblockOffer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the offer by ID and update its status to 'active'
    await Offer.findByIdAndUpdate(id, { status: "active" }, { new: true });

    // Redirect to the offer list page
    // res.redirect('/admin/add-offer-product');
    return res
      .status(200)
      .json({ success: true, message: "Offer unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking offer:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


import Cart from "../model/Cart.js";
import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

// Add item to cart
// export const addToCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   console.log('productId',id)

//   // Check if the product exists
//   const product = await Product.findById(id);
//   console.log('product', product)
//   if (!product) {
//     throw new Error("Product not found");
//   }

//   // Check if the product is already in the cart
//   const existingCartItem = await Cart.findOne({
//     user: req.userAuthId,
//     product: id
//   });

//   if (existingCartItem) {
//     // Update the quantity if the item already exists in the cart
//     existingCartItem.quantity += quantity;
//     await existingCartItem.save();
//   } else {
//     // Add new cart item
//     const cartItem = await Cart.create({
//       user: req.userAuthId,
//       product: productId,
//       quantity,
//     });
//     await cartItem.save();
//   }

//   res.status(201).json({
//     status: "success",
//     message: "Item added to cart successfully",
    
//   });
// });
export const addToCart = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let { quantity,size,color } = req.body; // Ensure quantity is passed in the request body
     // Set a default quantity if undefined or invalid
   quantity = quantity && quantity > 0 ? parseInt(quantity, 10) : 1;
  
    // if (!quantity || quantity <= 0) {
    //   return res.status(400).json({ status: "error", message: "Invalid quantity" });
    // }
  
    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
   // Log the product price and quantity for debugging
  //  console.log("Product Price:", product.price);
  //  console.log("Quantity:", quantity);
    // Find the user's cart
    let cart = await Cart.findOne({ user: req.userAuthId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = await Cart.create({
        user: req.userAuthId,
        items: [],
      });
    }
  
    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === id
    );
  
    if (existingItemIndex > -1) {
      // Update the quantity and total price of the existing item
      cart.items[existingItemIndex].qty += quantity;
      cart.items[existingItemIndex].totalPrice += product.price * quantity;
    } else {
      // Add new item to the cart
      cart.items.push({
        product: id,
        qty: quantity,
        size, // Include size
        color, // Include color
        totalPrice: product.price * quantity,
      });
    }
  
    await cart.save();
  
    res.status(201).json({
      status: "success",
      message: "Item added to cart successfully",
    });
  });
  

// Get all items in the cart
export const getCart = asyncHandler(async (req, res) => {
//   const cartItems = await Cart.find({ user: req.userAuthId }).populate("items.product");
const cartItems = await Cart.find({ user: req.userAuthId })
.populate({
  path: "items.product",
  select: "name price images totalQty totalSold qtyLeft",
  
})
// console.log('cart',cartItems)
 // Modify the populated data to only include the first image
 // Log each item in the items array for inspection
cartItems.forEach((cartItem) => {
    // console.log('Items in cart:', cartItem.items);
    cartItem.items.forEach((item, index) => {
      // console.log(`Item ${index + 1}:`, item);
    });
  });
 cartItems.forEach(cart => {
    cart.items.forEach(item => {
       
      if (item.product && item.product.images && item.product.images.length > 0) {
        item.product.images = item.product.images.slice(0, 1); // Keep only the first image
      }
    });
  });

  res.json({
    status: "success",
    message: "Cart items fetched successfully",
    cartItems,
  });
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  console.log('cartItemId',productId)
  const objectIdProductId = new mongoose.Types.ObjectId(productId);

if (!mongoose.Types.ObjectId.isValid(objectIdProductId)) {
    res.status(400);
    throw new Error("Invalid productId");
  }

//   const cartItem = await Cart.findById(cartItemId);
const cartItems = await Cart.findOneAndUpdate (
    { "items.product": objectIdProductId }, // Find the cart with the product
    { $pull: { items: { product: objectIdProductId } } }, // Remove the item from the array
    { new: true } // Return the updated cart document
  );
  if (!cartItems) {
    throw new Error("Cart item not found");
  }

//   await cartItem.remove();

  res.json({
    status: "success",
    message: "Item removed from cart successfully",
  });
});

// Update cart item quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
 
// Ensure `productId` is cast to ObjectId

  const objectIdProductId = new mongoose.Types.ObjectId(productId);
//   const cartItem = await Cart.findById({ "items.product": productId,});
//   if (!cartItem) {
//     throw new Error("Cart item not found");
//   }
if (!mongoose.Types.ObjectId.isValid(objectIdProductId)) {
    res.status(400);
    throw new Error("Invalid productId");
  }
  // Fetch the product's price from the database
  const product = await Product.findById(objectIdProductId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

//   cartItem.quantity = quantity;
//   await cartItem.save();
 // Calculate the new totalPrice for the item
 const newTotalPrice = product.price * qty;
 const cartItems = await Cart.findOneAndUpdate(
  { "items.product": objectIdProductId },
  { $set: { "items.$.qty": qty, "items.$.totalPrice": newTotalPrice } },
  { new: true }
).populate("items.product");
// const cartItems = await Cart.findOneAndUpdate(
//     { "items.product": objectIdProductId }, // Find the cart with the product
//     {
//       $set: { "items.$.qty": qty }, // Update the quantity for the matched product
//       "items.$.totalPrice": newTotalPrice, // Update the totalPrice for the item
//     },
//     { new: true } // Return the updated cart document
//   );

  if (!cartItems) {
    throw new Error("Cart  not found");
  }
 

  res.json({
    status: "success",
    message: "Cart item updated successfully",
    // cartItems,
  });
});

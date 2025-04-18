
import Product from "../model/Product.js";
import Offer from "../model/Offer.js";
import Category from "../model/Category.js";



export const calculateAndUpdateSalesPrice = async (productId) => {
   
    console.log(`Starting sales price calculation for product: ${productId}`);
    const product = await Product.findById(productId)
    
    const category = await Category.findOne({ products: productId });
    
    
    const now = new Date();
    console.log('Current Time:', now);
   
      //      console.log('Offer query:', {
      //   applicableToProduct: product._id,
      //   status: 'active',
      //   startDate: { $lte: now},
      //   endDate: { $gte: now }
      // });
    // Debugging: Print out all offers to verify data
    const productOffersCheck = await Offer.find({ applicableToProduct: product._id });
   
 
    // Finding active offers for the product
    const productOffers = await Offer.find({
      applicableToProduct:product._id,
      status: 'active',
      isBlocked:false,
      startDate: { $lte: now },  // This ensures offers that started in the past are included
      endDate: { $gte: now }
    });
    
  
    // Finding active offers for the category of the product
    let categoryOffers=[]
    if(category){
         categoryOffers = await Offer.find({
            applicableToCategory: category._id,
            status: 'active',
            isBlocked:false,
            startDate: { $lte: now },
            endDate: { $gte: now }
          });
        

    }
    

    let discount = 0;
  
    // If there are product-specific offers, apply the highest discount
    if (productOffers.length > 0) {
      productOffers.forEach(offer => {
        if (offer.offerType === 'percentage') {
          discount = Math.max(discount, offer.offerValue); // Apply the maximum percentage discount
        } else if (offer.offerType === 'fixed') {
          discount = Math.max(discount, (offer.offerValue / product.price) * 100); // Convert fixed discount to percentage for comparison
        }
      });
    }
  
    // If there are category-specific offers, compare the discounts
    if (categoryOffers.length > 0) {
      categoryOffers.forEach(offer => {
        if (offer.offerType === 'percentage') {
          discount = Math.max(discount, offer.offerValue); // Apply the maximum percentage discount for the category
        } else if (offer.offerType === 'fixed') {
          discount = Math.max(discount, (offer.offerValue / product.price) * 100); // Convert fixed discount to percentage for comparison
        }
      });
    }
  
    // Calculate the new sales price based on the highest discount found
    let salesPrice = product.price;
    if (discount > 0) {
      salesPrice = product.price * (1 - discount / 100);
    }
  
    // Update the sales price and save the product
    product.salesPrice = salesPrice.toFixed(2) // Ensure the price is rounded to 2 decimal places
    await product.save();
  
    return product.salesPrice; // Return the updated sales price
  };
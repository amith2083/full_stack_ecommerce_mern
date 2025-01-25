import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category:{
        type:String,
        ref:'Category',
        required:true
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },

    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    color: {
        type: [String],
        required:true
      },
    
    images: [
      {
        type: String,
       required:true
        
      },
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    // reviewCount: {
    //   type: Number,
    //   default: 0,
    // },
    
    price: {
      type: Number,
      required: true,
    },
    salesPrice: {
      type: Number,
      default: function () {
        return this.normalPrice; // Set salesPrice equal to regularPrice by default
      },
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold:{
        type:Number,
        required:true,
        default:0
    },
    // status:{
    //     type:String,
    //     required:false

    // },
    status: {
      type: Boolean,
      default: false,
    },
    // offers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Offer",
    //   },
    // ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, // Enable virtuals in Object output
  }
  
);

// Method to update salesPrice when offers are added/modified/expired
// ProductSchema.methods.updateSalesPriceWithOffers = async function () {
//     console.log(`Updating sales price for product: ${this.name}`);

//     // Fetch associated offers
//     await this.populate('offers').execPopulate();
//     console.log('Offers populated:', this.offers);
//     // If no active offers, keep the salesPrice unchanged
//     if (!this.offers || this.offers.length === 0) {
//         console.log('No active offers found. Sales price remains unchanged.');
//         return this.save();
//     }

//     // Apply only active offers to calculate the discounted price
//     const activeOffers = this.offers.filter(offer => offer.status === 'active' && !offer.isExpired);

//     if (activeOffers.length === 0) {
//         // If no active offers, keep the salesPrice unchanged
//         return this.save();
//     }

//     // Apply active offers to adjust the sales price
//     let discountedPrice = this.salesPrice;

//     activeOffers.forEach(offer => {
//         if (offer.offerType === 'percentage') {
//             discountedPrice -= (discountedPrice * offer.offerValue / 100);
//             console.log(`Applying percentage offer: ${offer.offerValue}%`);
//         } else if (offer.offerType === 'fixed') {
//             discountedPrice -= offer.offerValue;
//             console.log(`Applying fixed discount offer: ${offer.offerValue}`);
//         }
//     });

//     // Ensure the discounted price does not go below 0
//     discountedPrice = Math.max(discountedPrice, 0);
// // Update salesPrice only if it changes
// if (this.salesPrice !== discountedPrice) {
//     this.salesPrice = discountedPrice;
//     console.log(`Sales price updated to: ${this.salesPrice}`);
// } else {
//     console.log('Sales price remains the same.');
// }

//     return this.save();
// };
// Product.js
//Total rating
ProductSchema.virtual("totalReviews").get(function () {
    const product = this;
    return product?.reviews?.length;
  });
  //average Rating
  ProductSchema.virtual("averageRating").get(function () {
    let ratingsTotal = 0;
    const product = this;
    product?.reviews?.forEach((review) => {
      ratingsTotal += review?.rating;
    });
    //calc average rating
    const averageRating = Number(ratingsTotal / product?.reviews?.length).toFixed(
      1
    );
    return averageRating;
  });
  //qty left
ProductSchema.virtual("qtyLeft").get(function () {
    const product = this;
    return product.totalQty - product.totalSold;
  });

const Product = mongoose.model("Product", ProductSchema);
export default Product;

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      qty: { type: Number, },
      totalPrice: { type: Number,  },
      color: { type: String,  },
      size: { type: String,  },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

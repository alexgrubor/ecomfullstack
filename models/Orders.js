import mongoose from "mongoose";
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [OrderItemSchema]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model("orders", OrderSchema);

export default Order;

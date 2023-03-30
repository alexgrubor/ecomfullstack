import Order from "../models/Orders.js";
import { stripe } from "../server.js";
import Products from "../models/Products.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "-profileImg -password")
      .populate("orderItems");
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    const order = await Order.find({ userId: userId }).populate(
      "orderItems.product"
    );
    if (order) {
      res.json({
        success: true,
        data: order,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrderStripe = async (req, res) => {
  const { orderItems } = req.body;

  try {
    const line_items = [];
    for (let i = 0; i < orderItems.length; i++) {
      const product = await Products.findById(orderItems[i].product);
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            images: [product.thumbnail],
            description: product.description,
          },
          unit_amount: product.price * 100,
        },
        quantity: orderItems[i].quantity,
      });
    }
    const session = await stripe.checkout.sessions.create({
      line_items,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "https://ecomfullstact.onrender.com/#/cart?success=true",
      cancel_url: "https://ecomfullstact.onrender.com/#/cart?success=false",
    });
   
 
    
  
  
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
 
};

export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (deletedOrder) {
      res.status(200).json({
        success: true,
        data: deletedOrder,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

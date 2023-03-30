import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./routes/productsRoutes.js";
import userRouter from "./routes/usersRoutes.js";
import orderRouter from "./routes/ordersRoutes.js";
import fileupload from "express-fileupload";
import Image from "./models/Images.js";
import stream from "stream";


const app = express();
dotenv.config();
import Stripe from "stripe";
export const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views/dist"));

// if you have http://localhost, you need to add exposedHeaders

//routes
app.get("/", (req, res) => {
  res.sendFile("./views/dist/index.html", {
    root: ".",
  });
});
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.get("/images/:filename", async (req, res) => {
  const image = await Image.findOne({
    filename: req.params.filename,
  });
  if (!image) {
    res.status(404).send("Image not found");
  }
  const readStream = stream.Readable.from(image.data);
  readStream.pipe(res);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/e-com")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "tmp/" });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const ONLINE_TIMEOUT_MS = 25000;
const onlineSessions = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, lastSeen] of onlineSessions.entries()) {
    if (now - lastSeen > ONLINE_TIMEOUT_MS) {
      onlineSessions.delete(sessionId);
    }
  }
}, 5000);

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  color: String,
  description: String,
  oldPrice: Number,
  newPrice: Number,
  sizes: [String],
  rating: Number,
  category: String,
  brand: String,
  images: [String],
  inStock: Number,
  available: Boolean,
  isNew: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

const commentSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  authorName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  avatar: { type: String, default: "" },
  text: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      size: String,
      color: String,
      quantity: Number,
      image: String,
    },
  ],
  total: Number,
  status: {
    type: String,
    enum: ["новий", "в обробці", "відправлено", "доставлено", "скасовано"],
    default: "новий",
  },
  customer: {
    name: String,
    surname: String,
    phone: String,
    mail: String,
  },
  city: String,
  department: String,
  sessionId: String,
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

const visitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  ip: String,
  userAgent: String,
  language: String,
  referrer: String,
  platform: String,
  screenWidth: Number,
  screenHeight: Number,
  viewportWidth: Number,
  viewportHeight: Number,
  timezone: String,
  name: String,
  surname: String,
  phone: String,
  mail: String,
  pageViews: { type: Number, default: 1 },
  visitDates: [String],
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
});

const Visitor = mongoose.model("Visitor", visitorSchema);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress;
}

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: Date.now(),
  });
});

app.post("/api/heartbeat", async (req, res) => {
  const sessionId = String(req.body?.sessionId || "").trim();
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }

  onlineSessions.set(sessionId, Date.now());

  const {
    language,
    referrer,
    platform,
    screenWidth,
    screenHeight,
    viewportWidth,
    viewportHeight,
    timezone,
  } = req.body || {};

  const ip = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "";
  const day = todayKey();

  try {
    await Visitor.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          ip,
          userAgent,
          language,
          referrer,
          platform,
          screenWidth,
          screenHeight,
          viewportWidth,
          viewportHeight,
          timezone,
          lastSeen: new Date(),
        },
        $inc: { pageViews: 1 },
        $addToSet: { visitDates: day },
        $setOnInsert: { firstSeen: new Date() },
      },
      { upsert: true, new: true },
    );
  } catch (e) {
    console.error("VISITOR UPSERT ERROR:", e.message);
  }

  res.json({ status: "ok" });
});

app.post("/api/visitors/identify", async (req, res) => {
  const sessionId = String(req.body?.sessionId || "").trim();
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }
  const { name, surname, phone, mail } = req.body;
  try {
    const visitor = await Visitor.findOneAndUpdate(
      { sessionId },
      { $set: { name, surname, phone, mail } },
      { upsert: true, new: true },
    );
    res.json(visitor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/online-count", (req, res) => {
  res.json({ online: onlineSessions.size });
});

app.get("/api/visitors/stats", async (req, res) => {
  try {
    const day = String(req.query.date || todayKey());
    const daily = await Visitor.countDocuments({ visitDates: day });
    const total = await Visitor.countDocuments();
    res.json({ date: day, dailyVisitors: daily, totalVisitors: total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/visitors", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ lastSeen: -1 });
    res.json(visitors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/visitors/:sessionId", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ sessionId: req.params.sessionId });
    if (!visitor) return res.status(404).json({ error: "Не знайдено" });
    res.json(visitor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/uploadImage", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("PRODUCTS ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    await Product.updateOne({ id: Number(req.params.id) }, { $set: req.body });
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/api/products/:id/stock", async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ error: "Товар не знайдений" });
    if (product.inStock < quantity)
      return res.status(400).json({ error: "Недостатньо товару на складі" });

    product.inStock -= quantity;
    product.available = product.inStock > 0;
    await product.save();
    res.json({
      success: true,
      inStock: product.inStock,
      available: product.available,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.deleteOne({ id: Number(req.params.id) });
    await Comment.deleteMany({ productId: Number(req.params.id) });
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/comments", async (req, res) => {
  try {
    const filter = {};
    if (req.query.productId) filter.productId = Number(req.query.productId);
    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const { productId, authorName, rating, avatar, text } = req.body;

    const product = await Product.findOne({
      id: Number(productId),
    });

    if (!product) {
      return res.status(404).json({
        error: "Товар не знайдений",
      });
    }

    const comment = await Comment.create({
      productId: Number(productId),
      authorName,
      rating,
      avatar,
      text,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});

app.delete("/api/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment)
      return res.status(404).json({ error: "Коментар не знайдений" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const {
      items,
      total,
      name,
      surname,
      phone,
      mail,
      city,
      department,
      sessionId,
    } = req.body;
    const order = new Order({
      items,
      total,
      customer: { name, surname, phone, mail },
      city,
      department,
      sessionId,
    });
    await order.save();

    if (sessionId) {
      await Visitor.findOneAndUpdate(
        { sessionId },
        { $set: { name, surname, phone, mail } },
        { upsert: true },
      );
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: "Не вдалося створити замовлення" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ error: "Замовлення не знайдено" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: "Невірний ідентифікатор" });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!order)
      return res.status(404).json({ error: "Замовлення не знайдено" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: "Не вдалося оновити замовлення" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res.status(404).json({ error: "Замовлення не знайдено" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

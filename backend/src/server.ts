import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import linkRoutes from "./routes/linkRoutes";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/trim";
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB Connected Successfully."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/", linkRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Backend server active on port ${PORT}`));
}

export default app;
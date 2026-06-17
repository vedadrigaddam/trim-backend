import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import linkRoutes from "./routes/linkRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/trim").then(() => console.log("MongoDB Connected Successfully."));

app.use("/", linkRoutes);
app.use(errorHandler);

app.listen(5000, () => console.log("Backend server active on port 5000"));
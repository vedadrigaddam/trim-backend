import { Schema, model } from "mongoose";
const ClickSchema = new Schema({ timestamp: { type: Date, default: Date.now }, referrer: { type: String, default: "Direct" }, device: { type: String, default: "Unknown" } }, { _id: false });
const LinkSchema = new Schema({ longUrl: { type: String, required: true }, shortCode: { type: String, required: true, unique: true, index: true }, clicksCount: { type: Number, default: 0 }, analytics: [ClickSchema] }, { timestamps: true });
export const Link = model("Link", LinkSchema);
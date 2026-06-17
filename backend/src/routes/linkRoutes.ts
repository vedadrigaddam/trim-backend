import { Router } from "express";
import { createShortLink, handleRedirect, getAllLinks, getAnalytics } from "../controllers/linkController";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Trim URL Shortener API is active and running!" });
});

router.post("/api/links", createShortLink);
router.get("/api/links", getAllLinks);
router.get("/api/links/:code/analytics", getAnalytics);
router.get("/:code", handleRedirect);
export default router;
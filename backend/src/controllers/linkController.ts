import { Request, Response, NextFunction } from "express";
import { Link } from "../models/Link";
import { nanoid } from "nanoid";
import validUrl from "valid-url";
import useragent from "useragent";

export const createShortLink = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { longUrl, customAlias } = req.body;
    if (!longUrl || !validUrl.isWebUri(longUrl)) return res.status(400).json({ error: "Invalid URL layout. Provide http:// or https://" });
    if (longUrl.toLowerCase().startsWith('javascript:') || longUrl.toLowerCase().startsWith('data:')) return res.status(400).json({ error: "Malicious script blocked." });
    
    let shortCode = customAlias ? customAlias.trim() : '';
    if (shortCode) {
      if (await Link.findOne({ shortCode })) return res.status(409).json({ error: "Alias already claimed." });
    } else { shortCode = nanoid(6); }
    
    const newLink = await Link.create({ longUrl, shortCode });
    res.status(201).json({ longUrl: newLink.longUrl, shortCode: newLink.shortCode, shortUrl: "http://localhost:5000/" + newLink.shortCode });
  } catch (error) { next(error); }
};

export const handleRedirect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });
    if (!link) return res.status(404).send("<h1>404 Link Shortcut Not Found</h1>");
    
    const agent = useragent.parse(req.headers["user-agent"]);
    await Link.updateOne({ _id: link._id }, { $inc: { clicksCount: 1 }, $push: { analytics: { referrer: req.headers["referer"] || "Direct", device: agent.device.family || "Desktop" } } });
    res.redirect(302, link.longUrl);
  } catch (error) { next(error); }
};

export const getAllLinks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links.map(l => ({ id: l._id, longUrl: l.longUrl, shortCode: l.shortCode, shortUrl: "http://localhost:5000/" + l.shortCode, clicksCount: l.clicksCount })));
  } catch (error) { next(error); }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });
    if (!link) return res.status(404).json({ error: "Data missing." });
    
    const timeSeries = {}; const deviceBreakdown = {}; const referrerBreakdown = {};
   
    res.json({ totalClicks: link.clicksCount, timeSeries, deviceBreakdown, referrerBreakdown });
  } catch (error) { next(error); }
};
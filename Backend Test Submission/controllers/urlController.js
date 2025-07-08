const { urls, analytics } = require('../models/db');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const geoip = require('geoip-lite');
const Log = require('logging-middleware');

function generateShortcode() {
    return uuidv4().slice(0, 6);
}

function isExpired(expiry) {
    return dayjs().isAfter(expiry);
}

exports.createShortUrl = async (req, res) => {
    const { url, validity, shortcode } = req.body;

    try {
        const now = dayjs();
        const expiry = validity ? now.add(validity, 'minute') : now.add(30, 'minute');
        const code = shortcode || generateShortcode();

        if (urls.has(code)) {
            await Log("backend", "error", "handler", "Shortcode already exists");
            return res.status(409).json({ message: "Shortcode already exists" });
        }

        urls.set(code, {
            url,
            createdAt: now.toISOString(),
            expiry: expiry.toISOString()
        });

        analytics.set(code, {
            totalClicks: 0,
            clicks: []
        });

        await Log("backend", "info", "controller", "Short URL created successfully");

        return res.status(201).json({
            shortLink: `http://localhost:5000/${code}`,
            expiry: expiry.toISOString()
        });

    } catch (error) {
        await Log("backend", "fatal", "handler", "Unexpected error during URL creation");
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getStats = async (req, res) => {
    const shortcode = req.params.shortcode;

    try {
        if (!urls.has(shortcode)) {
            await Log("backend", "warn", "repository", "Shortcode not found for stats");
            return res.status(404).json({ message: "Shortcode not found" });
        }

        const urlData = urls.get(shortcode);
        const clickData = analytics.get(shortcode);

        return res.status(200).json({
            shortcode,
            url: urlData.url,
            createdAt: urlData.createdAt,
            expiry: urlData.expiry,
            totalClicks: clickData.totalClicks,
            clicks: clickData.clicks
        });
    } catch (err) {
        await Log("backend", "error", "handler", "Failed to fetch stats");
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.redirectShortUrl = async (req, res) => {
    const shortcode = req.params.shortcode;

    try {
        if (!urls.has(shortcode)) {
            await Log("backend", "warn", "repository", "Shortcode not found for redirect");
            return res.status(404).json({ message: "Shortcode not found" });
        }

        const urlData = urls.get(shortcode);

        if (isExpired(urlData.expiry)) {
            await Log("backend", "info", "controller", "URL has expired");
            return res.status(410).json({ message: "Short URL has expired" });
        }

        // Track click
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const geo = geoip.lookup(ip) || {};
        const referrer = req.get('Referrer') || 'unknown';

        const clickEntry = {
            timestamp: dayjs().toISOString(),
            referrer,
            location: geo.city || 'unknown'
        };

        const clickData = analytics.get(shortcode);
        clickData.totalClicks += 1;
        clickData.clicks.push(clickEntry);

        await Log("backend", "info", "controller", `Redirecting to ${urlData.url}`);

        return res.redirect(urlData.url);
    } catch (err) {
        await Log("backend", "error", "handler", "Failed to redirect");
        return res.status(500).json({ message: "Internal server error" });
    }
};

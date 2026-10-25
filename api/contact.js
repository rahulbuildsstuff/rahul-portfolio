// Vercel serverless function: POST /api/contact
const nodemailer = require("nodemailer");

const hits = new Map(); // per-IP limit: 3 messages / 10 minutes (resets on cold start)
const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const ip = String(req.headers["x-forwarded-for"] || "anon").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60000);
  if (recent.length >= 3) return res.status(429).json({ error: "Too many messages. Please try again later." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (body.website) return res.status(200).json({ ok: true }); // honeypot

  const name = String(body.name || "").replace(/[\r\n<>"]/g, " ").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
  if (!name || name.length > 80 || !validEmail || message.length < 5 || message.length > 2000) {
    return res.status(400).json({ error: "Please fill in all fields correctly." });
  }
  hits.set(ip, [...recent, now]);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `Portfolio <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO || process.env.GMAIL_USER,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><b>${esc(name)}</b> (${esc(email)})</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact mail failed:", err);
    return res.status(500).json({ error: "Couldn’t send your message. Please try again." });
  }
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';

// تأكد من تحميل ملف الإعدادات بشكل صحيح
dotenv.config({ path: 'env.local' });

const app = express();

// إعدادات الـ Middleware
app.use(cors());
app.use(express.json());

// إعداد خدمة البريد الإلكتروني
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true لـ 465, false للمنافذ الأخرى
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// إعداد Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// المسار الرئيسي للتحقق من عمل السيرفر
app.get('/', (req, res) => {
  res.json({ message: "AttendX API is live and working!" });
});

// مسار Gemini
app.post('/api/ask-gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "النص مطلوب" });
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "المساعد غير متاح حالياً" });
  }
});

// مسار البريد الإلكتروني
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) return res.status(400).json({ error: "بيانات الإرسال ناقصة" });
    
    await transporter.sendMail({ 
      from: process.env.SMTP_USER, 
      to, 
      subject, 
      text 
    });
    res.json({ message: "تم الإرسال بنجاح!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "فشل الإرسال" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

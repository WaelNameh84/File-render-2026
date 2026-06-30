import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

// إعدادات الـ Middleware الأساسية
app.use(cors());
app.use(express.json());

// إعداد خدمة البريد الإلكتروني (Nodemailer)
// الكود هنا يقرأ مباشرة من إعدادات Render (Environment Variables)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // تم ضبطه في Render
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // يعمل مع المنفذ 587
  auth: {
    user: process.env.SMTP_USER, // تم ضبطه في Render
    pass: process.env.SMTP_PASS, // كود الـ 16 حرفاً من جوجل
  },
});

// إعداد Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// مسار تجريبي للتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.status(200).json({ status: "success", message: "AttendX API is online!" });
});

// مسار معالجة طلبات المساعد الذكي
app.post('/api/ask-gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "الرجاء إدخال نص السؤال" });
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ response: response.text() });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ error: "عذراً، المساعد الذكي غير متاح حالياً" });
  }
});

// المسار المسؤول عن إرسال الإيميلات (تم تحسينه للعمل مع Gmail)
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  if (!to || !subject || !text) {
    return res.status(400).json({ error: "بيانات الإرسال غير مكتملة" });
  }

  try {
    const mailOptions = {
      from: `"AttendX System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    res.json({ message: "تم إرسال البريد بنجاح!" });
  } catch (error) {
    console.error("Email Sending Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء محاولة إرسال البريد" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AttendX Server is running on port ${PORT}`);
});

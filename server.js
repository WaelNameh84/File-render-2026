import express from 'express';
import cors from 'cors';
import * as brevo from '@getbrevo/brevo'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

app.use(cors());
app.use(express.json());

// إعداد Brevo API باستخدام المتغير الذي سنضعه في Render
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// إعداد Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.get('/', (req, res) => {
  res.status(200).json({ status: "success", message: "AttendX API is online!" });
});

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

// المسار المحدث لإرسال الإيميل عبر API
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  
  if (!to || !subject || !text) {
    return res.status(400).json({ error: "بيانات الإرسال غير مكتملة" });
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = { "name": "AttendX", "email": "info@attendx.com" }; 
    sendSmtpEmail.to = [{ "email": to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    res.json({ message: "تم إرسال البريد بنجاح!" });
  } catch (error) {
    console.error("Brevo API Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء محاولة إرسال البريد" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AttendX Server is running on port ${PORT}`);
});

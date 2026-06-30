import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// إعدادات الـ Middleware الأساسية
app.use(cors());
app.use(express.json());

// مسار فحص الصحة (لضمان أن Render يراه فعالاً دائماً)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// مسار تجريبي للتأكد من أن الـ API يعمل
app.get('/', (req, res) => {
  res.status(200).json({ message: 'AttendX API is live and running!' });
});

// هنا يمكنك إضافة مسارات الـ API الخاصة بك لاحقاً
// app.use('/api', attendanceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

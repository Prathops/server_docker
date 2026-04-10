const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads dir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// SIMPLE CORS
app.use(cors({
  origin: ['http://localhost:5001'],
}));

app.use(express.json());
app.use('/api/uploads', express.static(uploadsDir));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

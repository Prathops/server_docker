const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env.local for local development (takes priority)
// Fall back to .env for Docker/production
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration - only allow frontend on localhost and frontend.local
const allowedOrigins = [
  // 'http://localhost:5011',       // Development: localhost
  'http://frontend.local:5011',  // Local domain
  'https://frontend.local:5011'  // Local domain with HTTPS
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 3600 // Cache preflight requests for 1 hour
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/items', itemRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

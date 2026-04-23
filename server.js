const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = require('./src/config/db');
const blobService = require('./src/services/blobService');

const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.set('trust proxy', 1);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
.split(',')
.map((origin) => origin.trim())
.filter(Boolean);

app.use(cors({
origin: (origin, callback) => {
if (!origin) return callback(null, true);
if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
return callback(null, true);
}
return callback(new Error('CORS blocked for this origin'));
},
credentials: false
}));

app.use(express.json());
app.use('/api/uploads', express.static(uploadsDir));

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/health/ready', async (_req, res) => {
	const checks = {
		db: { ok: false },
		blob: { ok: false }
	};

	try {
		await pool.query('SELECT 1');
		checks.db = { ok: true };
	} catch (error) {
		checks.db = { ok: false, error: error.message };
	}

	try {
		await blobService.checkHealth();
		checks.blob = { ok: true };
	} catch (error) {
		checks.blob = { ok: false, error: error.message };
	}

	const ok = checks.db.ok && checks.blob.ok;
	res.status(ok ? 200 : 503).json({
		status: ok ? 'ready' : 'not-ready',
		checks
	});
});

app.use('/api/items', itemRoutes);

app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
	console.log('Backend running on port ' + PORT);
});
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import testingRoutes from './routes/testing.routes.js';
import initDatabase from "./config/initDb.js";

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database (migrations + testing table)
initDatabase().catch(err => {
    console.error("Failed to initialize database:", err);
});

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/testing', testingRoutes);





// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'SchulNetz Backend' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
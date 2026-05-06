import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { configDotenv } from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Routes
import authRoutes from './routes/auth.js';
import kostRoutes from './routes/kost.js';
import reservationRoutes from './routes/reservation.js';

app.use('/api/auth', authRoutes);
app.use('/api/kosts', kostRoutes);
app.use('/api/reservations', reservationRoutes);

// Serve static files from the React app
app.use(express.static(path.join(path.resolve(), 'frontend', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
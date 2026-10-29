import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import placementRoutes from './routes/placementRoutes.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusIQ Server',
    timestamp: new Date().toISOString()
  });
});

// Placement & Skill Test API
app.use('/api/placement', placementRoutes);

app.listen(PORT, () => {
  console.log(`CampusIQ Express API Server running on http://localhost:${PORT}`);
  console.log(`Placement routes available at http://localhost:${PORT}/api/placement`);
});

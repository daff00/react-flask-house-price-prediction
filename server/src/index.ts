import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import predictionRoutes from './routes/predictionRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/predictions', predictionRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
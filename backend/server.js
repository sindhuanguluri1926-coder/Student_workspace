import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Assignment from './models/Assignment.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check & status endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Student Assignment Workspace API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/status', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  let count = 0;
  try {
    if (isConnected) {
      count = await Assignment.countDocuments();
    }
  } catch (err) {
    console.error(err);
  }

  res.json({
    status: 'online',
    appName: 'Student Assignment Workspace API',
    dbMode: isConnected ? 'mongodb' : 'disconnected',
    isMongoConnected: isConnected,
    mongoHost: isConnected ? mongoose.connection.host : null,
    totalAssignments: count,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/assignments', assignmentRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Backend server running on port ${PORT}`);
});

export default app;

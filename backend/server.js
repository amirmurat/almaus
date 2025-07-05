const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Import routes
const subjectsRouter = require('./routes/subjects');
const gradesRouter = require('./routes/grades');
const profileRouter = require('./routes/profile');
const scheduleRouter = require('./routes/schedule');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/subjects', subjectsRouter);
app.use('/api/grades', gradesRouter);
app.use('/api/profile', profileRouter);
app.use('/api/schedule', scheduleRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Almau API is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Database test: http://localhost:${PORT}/api/test-db`);
  console.log(`📚 Subjects API: http://localhost:${PORT}/api/subjects`);
  console.log(`📊 Grades API: http://localhost:${PORT}/api/grades`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { app, prisma }; 
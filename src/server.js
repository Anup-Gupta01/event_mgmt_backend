require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║       🏰  RAJ MAHAL — API SERVER  🏰             ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  🚀  Running  →  http://localhost:${PORT}          ║`);
    console.log(`║  🌿  Env      →  ${(process.env.NODE_ENV || 'development').padEnd(29)}║`);
    console.log('║  🗄️  Database →  MongoDB (Atlas)                  ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
  });
});

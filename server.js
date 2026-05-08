const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.get('/', (req, res) => res.send('API OK'));

// Gestionnaire d'erreur SIMPLE (sans aucun appel next() implicite)
app.use((err, req, res, next) => {
  console.error('ERREUR ATTRAPEE:', err);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
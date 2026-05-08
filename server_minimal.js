
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

// Copie directe du contrôleur sans aucun middleware externe
app.post('/api/auth/register-session', async (req, res) => {
  try {
    const User = require('./models/User');
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email ou nom d\'utilisateur déjà utilisé' });
    }
    const user = await User.create({ username, email, password });
    user.password = undefined;
    res.status(201).json({ success: true, message: 'Inscription réussie', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/', (req, res) => res.send('API OK'));

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
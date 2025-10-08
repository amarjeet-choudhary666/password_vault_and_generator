const express = require('express');
const cors = require('cors');

const app = express();

// Simple CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/v1/api/user/login', (req, res) => {
  res.json({ message: 'Login endpoint reached', body: req.body });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
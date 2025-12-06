const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data for destinations
const destinations = [
  { id: 1, name: 'Paris', country: 'France', description: 'The City of Light' },
  { id: 2, name: 'Tokyo', country: 'Japan', description: 'A blend of traditional and modern' },
  { id: 3, name: 'New York', country: 'USA', description: 'The City That Never Sleeps' },
  { id: 4, name: 'Dubai', country: 'UAE', description: 'City of Gold' },
  { id: 5, name: 'London', country: 'UK', description: 'Historic and vibrant capital' },
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Musafir API' });
});

app.get('/api/destinations', (req, res) => {
  res.json(destinations);
});

app.get('/api/destinations/:id', (req, res) => {
  const destination = destinations.find(d => d.id === parseInt(req.params.id));
  if (!destination) {
    return res.status(404).json({ message: 'Destination not found' });
  }
  res.json(destination);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

const express = require('express');
const cors = require('cors');

const app = express();
const joins = [];
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/join', (req, res) => {
const { eventCode, phoneNumber, consentGiven, source } = req.body;
const join = {
  eventCode,
  phoneNumber,
  consentGiven: !!consentGiven,
  source: source || 'unknown',
  timestamp: new Date().toISOString(),
};

  joins.push(join);

  console.log('JOIN:', eventCode);
  console.log('TOTAL JOINS:', joins.length);

  res.json({
    success: true,
    eventCode,
    totalJoins: joins.length,
  });
});

app.get('/joins/:eventCode', (req, res) => {
const { eventCode } = req.params;
  const eventJoins = joins.filter(j => j.eventCode === eventCode);

  res.json({
    eventCode,
    total: eventJoins.length,
    joins: eventJoins,
  });
});
app.get('/report/:eventCode', (req, res) => {
  const { eventCode } = req.params;

  const eventJoins = joins.filter(j => j.eventCode === eventCode);
  const totalJoins = eventJoins.length;
  const totalWithConsent = eventJoins.filter(j => j.consentGiven).length;
  const totalWithPhoneNumber = eventJoins.filter(
    j => j.phoneNumber && j.phoneNumber.trim() !== ''
  ).length;

  res.json({
    eventCode,
    totalJoins,
    totalWithConsent,
    totalWithPhoneNumber,
    joins: eventJoins,
  });
});
app.get('/event/:eventCode', (req, res) => {
  const { eventCode } = req.params;

res.json({
  eventCode,
  artistName: 'Test Artist',
  artistLogo: 'https://via.placeholder.com/800x500.png?text=Test+Artist+Logo',
  venue: 'Test Venue',
  city: 'Oslo',
  state: 'ready',
  unlockAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
  reward: {
    type: 'image',
    title: 'Digital Souvenir',
    url: 'https://via.placeholder.com/800x1000.png?text=Digital+Souvenir'
  }
});
});
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
// We must use 'node-fetch' v2 for this 'require' syntax
const fetch = require('node-fetch');

const app = express();
// Use the PORT environment variable Render gives us, or 3001
const PORT = process.env.PORT || 3001;

// Enable CORS for all domains
app.use(cors());

// This is our proxy endpoint
app.get('/api/*', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  // Get the path after /api/
  // e.g., /api/top-headlines?country=us -> top-headlines?country=us
  const originalPath = req.url.replace('/api/', '');
  const targetUrl = `https://newsapi.org/v2/${originalPath}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return res.status(apiResponse.status).json(errorData);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Home page route (so it doesn't show an error)
app.get('/', (req, res) => {
  res.send('News API proxy is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PO
RT}`);
});

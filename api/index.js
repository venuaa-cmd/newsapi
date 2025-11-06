// No 'node-fetch' import needed. Vercel has it built-in.

module.exports = async (req, res) => {

  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  // Get the part of the URL after /api/
  const originalPath = req.url.replace('/api/', '');
  const targetUrl = `https://newsapi.org/v2/${originalPath}`;

  try {
    // Use the built-in 'fetch'
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

    // Set CORS header
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' })
      ;
  }
};

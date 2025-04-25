const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  console.log(`Proxying request to: ${targetUrl}`); // Keep log for debugging

  try {
    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Add 'Authorization': 'Bearer YOUR_TOKEN_API_KEY' here if needed for production API
      },
    });

    const data = await apiResponse.json();
    res.status(apiResponse.status).json(data); // Forward status and data

  } catch (error) {
    console.error('Proxy error:', error); // Keep error log
    // Attempt to provide a more specific error status if possible
    let statusCode = 500;
    if (error.message.includes('invalid json')) {
        statusCode = 502; // Bad Gateway - upstream sent invalid response
    } else if (error.type === 'system') {
        statusCode = 503; // Service Unavailable - DNS/network issue
    }
    res.status(statusCode).json({ error: 'Proxy failed to fetch from target URL', details: error.message });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Default route (serves index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
  console.log(`Frontend accessible at http://localhost:${PORT}`);
}); 
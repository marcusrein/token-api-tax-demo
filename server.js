const express = require('express');
const fetch = require('node-fetch'); // Use node-fetch v2 for CommonJS
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Use port 3001 or environment variable

// Middleware to set CORS headers
app.use((req, res, next) => {
  // Allow requests from any origin for simplicity in this demo
  res.header('Access-Control-Allow-Origin', '*'); 
  // Allow common headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url; // Get target URL from query param

  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  console.log(`Proxying request to: ${targetUrl}`);

  try {
    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Add any other headers the target API might need
        // 'Authorization': 'Bearer YOUR_TOKEN_API_KEY' // If needed
      },
    });

    const data = await apiResponse.json();

    // Forward the status code and data from the target API
    res.status(apiResponse.status).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from target URL', details: error.message });
  }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '.'))); // Serve files from the current directory

// Default route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
  console.log(`Frontend accessible at http://localhost:${PORT}`);
}); 
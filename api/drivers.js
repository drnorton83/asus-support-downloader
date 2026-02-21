// Serverless function for Drivers API - works with Vercel/Netlify
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { website = 'us', model, osid } = req.query;

  if (!model) {
    return res.status(400).json({ error: 'Model parameter is required' });
  }

  if (!osid) {
    return res.status(400).json({ error: 'OS ID parameter is required' });
  }

  try {
    const url = new URL('https://www.asus.com/support/api/product.asmx/GetPDDrivers');
    url.searchParams.set('website', website);
    url.searchParams.set('model', model);
    url.searchParams.set('osid', osid);

    const response = await fetch(url.toString());
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching drivers data:', error);
    res.status(500).json({ error: 'Failed to fetch drivers from ASUS API' });
  }
}

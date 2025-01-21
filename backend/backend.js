const { dockerize } = ('./docker.js');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/api/:imageName', async (req, res) => {
  try {
    const imageName = req.params.imageName;
    console.log('1'); 
    await dockerize(imageName);
    } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to start the challenge container.' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

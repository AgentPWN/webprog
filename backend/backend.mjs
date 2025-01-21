import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // Import fileURLToPath to convert the module URL to a path
import { dockerize } from './docker.mjs'; // Import the dockerize function

const app = express();
const PORT = 3000;

// Recreate __dirname using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/api/:imageName', async (req, res) => {
    try {
      const imageName = req.params.imageName;
      console.log('1');
      await dockerize(imageName, res);  // Pass res to dockerize
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Failed to start the challenge container.' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

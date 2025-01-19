const express = require('express');
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Define the challenge API route
app.get('/api/challenge_1', async (req, res) => {
  try {
    console.log('1')
    const container = await docker.createContainer({
      Image: 'chal1',
      ExposedPorts: {
        '5000/tcp': {},
      },
      HostConfig: {
        PortBindings: {
          '5000/tcp': [
            {
              HostPort: '80', 
            },
          ],
        },
      },
    });
    console.log('2')
    console.log('Container created');
    await container.start();
    console.log('Container started');
    res.json({ message: '127.0.0.1:80' });
    setTimeout(async () => {
        try {
          await container.stop(); 
          console.log(`Container ${container.id} stopped after 10 seconds`);
          await container.remove();
          console.log(`Container ${container.id} removed`);
        } catch (err) {
          console.error(`Error stopping container ${container.id}:`, err);
        }
      }, 10 * 1000); // 2 minutes in milliseconds
    } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to start the challenge container.' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

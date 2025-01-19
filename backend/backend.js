const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
// Catch-all route to serve index.html
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });
app.get('/api/challenge_1', (req,res)=>{
    res.json({message:'oops the challenges aren\'t ready yet.'})
})
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

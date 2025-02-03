import express from 'express';
const app = express();
const PORT = 2000;
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.post('/api/bug_report', async(req,res) =>{
    const data = req.params.message;
    
});
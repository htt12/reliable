const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Route allows you go to index
//first thing '/' is always what 
app.get('/',(req, res) => {
   res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/peach',(req, res) => {
    res.sendFile(path.join(__dirname,'public','peach.html'));
});

app.get('/mario',(req, res) => {
    res.sendFile(path.join(__dirname,'public','mario.html'));
});

app.get('/toad',(req, res) => {
    res.sendFile(path.join(__dirname,'public','toad.html'));
});

app.post('/sendMario', (req, res) => {
    const { playerOne, playerTwo } = req.body;

    var player = {
        characters: [playerOne, playerTwo]
    };
    res.json(player);
});

app.listen(PORT, () => {
   console.log('This shits workin on port', PORT);
});

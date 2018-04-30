// Require needed modules / dependencies
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// Instantiate Express application and MySQL database connection
const PORT = 8000;

// === Consumption of middleware === //
app.use(session({
    secret: 'racecar',
    resave: false,
    saveUninitialized: false
    // cookie: { secure: true }
}));
app.use(cors()); // Allows Cross Origin Requests to be made to server -- Used in development
app.use(express.json()); // Used to parse data out of the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serves up all static files (JS, CSS, HTML)
app.use(express.static(path.join(__dirname, 'public', 'css')));
app.use(express.static(path.join(__dirname, 'public', 'js')));

//---Route allows you go to index //
//---first thing '/' is always what //
require('./routes/api')(app);
require('./routes/auth')(app);
require('./routes/pageroutes')(app);

io.on('connection', function(socket){
    console.log("user has connected");
    socket.on('chat message', function(msg){
        console.log(msg);
        io.emit('chat message', msg);
    });
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'chat.html'));
});

app.get("/sessiontest", (req, res) => {
    console.log("This is the req.session", req.session.userId);
    res.end();
});

app.get("/sessionupdate", (req, res) => {
    console.log("This is the req.session", req.session.userId);
    req.session.userId = 'keatonkrieger';
    res.end();
});




// ========================== Error Handling  Middleware ========================================= //
app.use(function (err, req, res, next) {
    if (err) {
        console.error(err);
        res.status(err.status || 500).json("Something broke!");
    }
    next();
});
// ========================== END OF ^^^ Error Handling Middleware ========================================= //

// ========================= Listening on PORT ======================================== //
http.listen(PORT, function(){
    console.log('listening on *:' + PORT);
});
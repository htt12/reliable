
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Route allows you go to index
//first thing '/' is always what
app.get('/',(req, res) => {
   res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/login',(req, res) => {
    res.sendFile(path.join(__dirname,'public','login.html'));
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
//-----------------------MySQL----------------------------//
var mysql = require('mysql');

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    port: 8889,
    database: 'reliable'

});
// function insertUser() {
//     var email = "yooooooooooooooo@whatup.com";
//     var password = "thisistotallysafe";
//     con.connect(function (err) {
//         if (err) throw err;
//         var sql = `INSERT INTO users (email, password) VALUES (${email}, ${password}))`;
//         con.query(sql, function (err, result) {
//             if (err) throw err;
//             console.log("WE SENT THIS SHIT")
//         })
//     });
// }

// function insertGoal() {
// let goal = "Workhardmane";
// let day = "Monday";
// let startdate = "3/12/17";
// let finishdate = "3/13/14";
    con.connect(function (err) {
        if (err) throw err;
        var sql = "INSERT INTO goals (goal, day, startdate, finishdate) VALUES ('Word hard', '3/13/34', 3/13/35)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("WE SENT THIS SHIT")
        })
    });
// }

// function readUsers() {
//     con.connect(function (err) {
//         if (err) throw err;
//         con.query("SELECT * FROM users", function (err, result, fields) {
//             if (err) throw err;
//             console.log(result)
//         });
//         console.log("Connected!")
//     });
// }
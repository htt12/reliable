// Require needed modules / dependencies
const express = require('express');
const mysql = require('mysql');
const credentials  = require('./config/mysqlCredentials');
const path = require('path');

// Instantiate Express application and MySQL database connection
const app = express();
const PORT = 8000;
const connection = mysql.createConnection(credentials);

// Verify if connection is successful
connection.connect((err)  => {
   if (err) throw err;

   console.log('Connected to database yo')
});

// === Consumption of middleware === //
// Used to parse data out of the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// === Routes === //
app.get('/dummyGoals',(req, res) => {
    res.sendFile(path.join(__dirname,'public/DummyJSON','dummyGoals.json'));
});
app.get('/dummyUsers',(req, res) => {
    res.sendFile(path.join(__dirname,'public/DummyJSON','dummyUsers.json'));
});
app.get('/', (req, res) => {
    res.send('whats up');
});
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
//---Route allows you go to index //
//---first thing '/' is always what //


//------------------------ALL GET AND POST REQUESTTS--------------------------------------//
// ==========GET ALL USERS===========//
app.get('/users', (req,res,next) => {
    let query = 'SELECT * FROM ??';
    let inserts = ['users'];

    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
        if (err) return next (err);

        const output = {
            success: true,
            data: results
        };
        res.json(output);
    });
});
//==========END OF GET ALL USERS===========//

//==========GET ALL GOALS===========//
app.get('/goals', (req,res,next) => {
    let query = 'SELECT * FROM ??';
    let inserts = ['goals'];

    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
        if (err) return next (err);

        const output = {
            success: true,
            data: results
        };
        res.json(output);
    });
});

//==========END OF GET ALL GOALS===========//

//==========POST USERS===========//
app.post('/users', (req,res,next) => {
    const { email, password } = req.body;

    let query = 'INSERT INTO ?? (??, ??) VALUES (?, ?)';
    let inserts = ['users', 'email', 'password', email, password];

    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
        if (err) return next (err);

        const output = {
            success: true,
            data: results
        };
        res.json(output);
    });
});

//==========END OF POST USERS===========//

//----------------------------END OF POST AND GET REQUESTS--------------------------------------//



// ========================== Error Handling  Middleware ========================================= //
app.use(function(err, req, res, next){
    if (err) {
        console.error(err);
        res.status(err.status || 500).json("Something broke!");
    }
    next();
});

// ========================== END OF ^^^ Error Handling Middleware ========================================= //


// ========================= Listening on PORT ======================================== //
app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
});

// ========================= END OF Listening on PORT ======================================== //

// app.get('/',(req, res) => {
//    res.sendFile(path.join(__dirname,'public','index.html'));
// });
//
// app.get('/login',(req, res) => {
//     res.sendFile(path.join(__dirname,'public','login.html'));
// });
//
// app.get('/mario',(req, res) => {
//     res.sendFile(path.join(__dirname,'public','mario.html'));
// });
//
// app.get('/toad',(req, res) => {
//     res.sendFile(path.join(__dirname,'public','toad.html'));
// });
//
// app.post('/sendMario', (req, res) => {
//     const { playerOne, playerTwo } = req.body;
//
//     var player = {
//         characters: [playerOne, playerTwo]
//     };
//     res.json(player);
// });
//
// app.listen(PORT, () => {
//    console.log('This shits workin on port', PORT);
// });
// //-----------------------MySQL----------------------------//
// var mysql = require('mysql');
//
// var con = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"root",
//     port: 8889,
//     database: 'reliable'
//
// });
//
//
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname, 'public')));
//-------------------------END OF SELECT STUDENTS--------------------------------------//
// var connectionObject = {
//     Insertgoal:
// };
//------------------------------Getting Error in SQL syntax -------------------//
//     con.connect(function (err) {
//         if (err) throw err;
//         var sql = "INSERT INTO users (email,password) VALUES ('Harison@gmail.com', 'FullStack123')";
//         con.query(sql, function (err, result) {
//             if (err) throw err;
//             console.log("WE SENT THIS SHIT")
//         })
//     });

//----------------------------INSERT GOAL TO PHPMYADMIN----------------------------------------------------------
//     con.connect(function (err) {
//         if (err) throw err;
//         var sql = "INSERT INTO goals (goal,day,startdate,finishdate) VALUES ('Get final project finished on time', 'Wensday, 3/28/18', '313', '997')";
//         con.query(sql, function (err, result) {
//             if (err) throw err;
//             console.log("WE SENT THIS SHIT")
//         })
//     });
// //

//---------------------------SETTING USER DATABASE INFO ---------------------------------------------
//     con.connect(function (err) {
//         if (err) throw err;
//         con.query("SELECT * FROM users", function (err, result, fields) {
//             if (err) throw err;
//             console.log(result)
//         });
//         console.log("Connected!")
//     });
//---------------------------GETTING GOAL DATABASE INFO ---------------------------------------------
// con.connect(function (err) {
//     if (err) throw err;
//     con.query("SELECT * FROM goals", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result)
//     });
//     console.log("Connected!")
// });
function getGoalsFromServer() {
    $.ajax({
            type: "GET",
            url: "http://localhost:8000/dummyGoals",
            dataType: "json",
            data: {
                ajaxid: 4,
                UserID: UserID,
                EmailAddress: EmailAdress
            },
            success: function (json_data) {
                var data = JSON.parse(json_data);
            }
        })
    }


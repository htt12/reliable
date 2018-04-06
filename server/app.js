// Require needed modules / dependencies
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const credentials  = require('./config/mysqlCredentials.js');
const path = require('path');


// Instantiate Express application and MySQL database connection
const app = express();
const PORT = 8000;
const connection = mysql.createConnection(credentials);

app.use(cors());

// Verify if connection is successful
connection.connect((err)  => {
    if (err) throw err;

    console.log('Connected to database yo')
});

// === Consumption of middleware === //
// Used to parse data out of the request body
app.use(cors());
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

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'public','login.html'));
});
app.get('/dashboard',(req, res) => {
    res.sendFile(path.join(__dirname,'public','dashboard.html'));
});
app.get('/goals',(req, res) => {
    res.sendFile(path.join(__dirname,'public','createGoal.html'));
});


//---Route allows you go to index //
//---first thing '/' is always what //


//------------------------ALL GET AND POST REQUESTTS--------------------------------------//
// ==========GET ALL USERS===========//
app.get('/userssql', (req,res,next) => {
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
app.get('/goalssql', (req,res,next) => {
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

//==========GET ALL GOALS BY GOAL ID===========//
app.get('/goalssql/:userID', (req,res,next) => {
    const { userID } = req.params;
    console.log("These are the params", req.params.userID);

    let query = 'SELECT * FROM ?? WHERE ?? = ?';
    let inserts = ['goals', 'userID', userID];
    console.log("inserts are: ", inserts);
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

//==========POST GOALS===========//
app.post('/goals', (req,res,next) => {
    const { goal, day, startdate, finishdate, timeframe  } = req.body;

    let query = 'INSERT INTO ?? (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)';
    let inserts = ['goals', 'goal', 'day', 'startdate', 'finishdate', 'timeframe', goal, day, startdate, finishdate, timeframe];

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

//---------------------------AJAX CALL EXAMPLES ----------------------------------------------------------------//
function postGoalToServer(goal, day, start, finish, timeframe) {
    $.ajax({
        type: "POST",
        url: "http://reliable.keatonkrieger.com/goals",
        dataType: "json",
        data: {
            goal: goal,
            day: day,
            startdate: start,
            finishdate: finish,
            timeframe: timeframe
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data)
        }
    })
}


function postUserToServer(email, password, status) {
    $.ajax({
        type: "POST",
        url: "http://reliable.keatonkrieger.com/users",
        dataType: "json",
        data: {
            email: email,
            password: password,
            status: status,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
        }
    })
}

function getGoalsFromServer() {
    $.ajax({
        type: "Get",
        url: "http://reliable.keatonkrieger.com/goals",
        success: function (json_data) {
            var data = JSON.parse(json_data);
            console.log(data)
        }
    })
}
//---------------------------END OF AJAX CALL EXAMPLES ----------------------------------------------------------------//
// Require needed modules / dependencies
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const credentials  = require('./config/mysqlCredentials.js');
const path = require('path');
const session = require('express-session');
// Instantiate Express application and MySQL database connection
const app = express();
const PORT = 8000;
const connection = mysql.createConnection(credentials);
//------------LOGIN--------------------------------//
const sha1 = require('sha1');
const bodyParser = require('body-parser');
//------------LOGIN--------------------------------//
app.use(cors());
//===================GLOBAL VARS=====================//
var id;
// Verify if connection is successful
connection.connect((err)  => {
    if (err) throw err;

    console.log('Connected to database yo')
});

// === Consumption of middleware === //

// Used to parse data out of the request body
app.use(cors());
app.use(session({ secret: 'racecar', cookie: { maxAge: 120000 }}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server')));
//------------LOGIN--------------------------------//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//------------LOGIN--------------------------------//
function generateRandomString(length){
    var possibles = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var output = '';
    while(output.length!==length){
        output += possibles[ (possibles.length * Math.random())>>0 ];
    }
    return output;
}
//==============COOO0O0O0O0O0O0O0O0KIES ARE BAD===================//
function didItAllForTheCookies(text){
    const cookies = text.split(';');
    const output = {};
    cookies.forEach( string => {
        const pieces = string.split('=');
        output[pieces[0].trim()] = pieces[1];
    });
    console.log('so you can take that wookie', output);
    return output;
}
//==============COOO0O0O0O0O0O0O0O0KIES ARE BAD===================//



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
app.get('/signUp',(req, res) => {
    res.sendFile(path.join(__dirname,'public','sign_up.html'));
});
app.get('/dashboard',(req, res) => {
    res.sendFile(path.join(__dirname,'public','dashboard.html'));
});

app.get('/goals',(req, res) => {
    res.sendFile(path.join(__dirname,'public','create_Goal.html'));
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
// app.get('/goalssql/user', (req,res,next) => {


//     connection.query(query, function(err, result){
//         console.log('err', err);
//         console.log('result', result);



app.get('/goalssql/:${userID}', (req,res,next) => {
    let { userID } = id;

    let query = 'SELECT * FROM goals WHERE EXISTS (SELECT 1 FROM loggedinUsers WHERE loggedinUsers.userID = goals.userID)';
    
    console.log("These are the params", id);

    // let query = 'SELECT * FROM ?? WHERE ?? = ?';
    let inserts = ['goals', 'userID', userID];
    console.log("inserts are: ", inserts);
    let sql = mysql.format(query, inserts);

    connection.query(sql, (err, results, fields) => {
        if (err) return next (err);

        const output = {
            success: true,
            data: result
        };
        res.json(output);

        
    });
});

//==========END OF GET ALL GOALS===========//

//==========POST GOALS===========//
app.post('/goalsPost', (req,res,next) => {
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

//==========END OF POST GOALS===========//

//==========POST USERS===========//
app.post('/users', (req,res,next) => {
    let { email, username, password } = req.body;
    password = sha1(password);
    let query = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)';
    let inserts = ['users', 'email', 'username', 'password', email, username, password];
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

//==========EDIT GOALS===========//
app.post('/goals/update', (req, res, next) => {
    const { goal_id, userID, goal, day, startdate, finishdate, timeframe  } = req.body;

    let query = 'UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?';
    let inserts = ['goals', 'userID', userID, 'goal', goal, 'day', day, 'startdate', startdate, 'finishdate', finishdate, 'timeframe', timeframe, 'goal_id', goal_id];
    console.log(query, inserts);
    let sql = mysql.format(query, inserts);
    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);
        const output = {
            success : true,
            data: results
        };
        res.json(output);
    })
});
//==========END OF EDIT GOALS===========//

//==========DELETE GOALS===========//
app.post('/goals/delete', (req, res, next) => {
    console.log('req', req.body);
    const { goal_id } = req.body;

    let query = 'DELETE FROM ?? WHERE ?? = ?'
    let inserts = ['goals', 'goal_id', goal_id];
    console.log(query, inserts);
    let sql = mysql.format(query, inserts);
    connection.query(sql, (err, results, fields) => {
        if (err) return next(err);
        const output = {
            success : true,
            data: results
        };
        res.json(output);
    })
});
//==========END OF DELETE GOALS===========//

//---------------------------------------LOGIN END ROUTES--------------------------------//

app.get('/students', function(req, res){
    var output = {
        success: false,
        errors: [],
        data: []
    };
    connection.connect(function(err){
        connection.query("SELECT first_name, first_name as doodah FROM users", function(err, results, fields){
            if(!err){
                output.success = true;
                output.data = results;
                output.fields = fields;

            } else {
                output.errors = err;
            }
            res.send(JSON.stringify(output));
        })
    })
});

app.get('/userCheck',function(req, res){
    const auth = didItAllForTheCookies(req.headers.cookie).userauth;
    console.log("check"+auth);
    if(auth){
        connection.connect(function(){
            var query = `SELECT * FROM loggedInUsers WHERE token='${auth}'`;
            console.log(query);
            connection.query(query, function(err, data){
                console.log(err, data);
                if(!err){
                    if(data.length){
                        res.redirect("/dashboard")
                        // res.send('the user is logged in');
                    } else {
                        res.redirect("/");
                        // res.send('the user is not logged in');
                    }
                } else {
                    res.send('error while checking user status');
                }
            });
        })
    } else {
        // res.send('no token available, user is not logged in')
        res.redirect("/");
    }
});

app.post('/login', function(req, res){
    console.log(req.body);
    req.body.password = sha1(req.body.password);
    connection.connect(function(err){
        console.log('db connected');
        connection.query(`SELECT ID, password FROM users WHERE email = '${req.body.email}'`, function(err, data, fields){
            if(data.length){
                if(data[0].password === req.body.password){
                    var user = data[0];
                    //user is valid
                    var userToken = generateRandomString(20) + Date.now();
                    id = `${user.ID}`;
                    console.log('This is the ID ' + id);
                    var query = `INSERT INTO loggedInUsers SET userID=${user.ID}, token='${userToken}', created=NOW()`;
                    console.log("query is "+query);
                    connection.query(query, function(err){
                        if(!err){
                            res.set('Set-Cookie','userauth='+userToken);
                            // res.send('http://localhost:8000/dashboard');
                            res.redirect("/dashboard");
                        }
                    });



                } else {
                    //right user, wrong pass
                    console.log('user is invalid');
                    res.redirect("/")



                }
            } else {
                //wrong user
                console.log('no such user');
                res.send('who are you?')
            }
        });
    })

});
//---------------------------------------END OF LOGIN CODE--------------------------------//


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


function postUserToServer(email, username, password, status) {
    $.ajax({
        type: "POST",
        url: "http://reliable.keatonkrieger.com/users",
        dataType: "json",
        data: {
            email: email,
            username: username,
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
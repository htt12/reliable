const mysql = require('mysql');
const sha1 = require('sha1');
const credentials = require('../config/mysqlCredentials.js');
const connection = mysql.createConnection(credentials);
const { generateRandomString, didItAllForTheCookies } = require('../helpers/h');

// Verify if connection is successful
connection.connect((err) => {
    if (err) throw err;

    console.log('Connected to database yo')
});

module.exports = function (app) {
    //==============COOO0O0O0O0O0O0O0O0KIES ARE BAD===================//

    app.get('/userCheck', function (req, res) {
        const auth = didItAllForTheCookies(req.headers.cookie).userauth;
        console.log("check" + auth);
        if (auth) {
            connection.connect(function () {
                var query = `SELECT * FROM loggedInUsers WHERE token='${auth}'`;
                console.log(query);
                connection.query(query, function (err, data) {
                    console.log(err, data);
                    if (!err) {
                        if (data.length) {
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

    app.post('/login', function (req, res) {
        console.log(req.body);
        req.body.password = sha1(req.body.password);
        connection.connect(function (err) {
            console.log('db connected');
            connection.query(`SELECT ID, password FROM users WHERE email = '${req.body.email}'`, function (err, data, fields) {
                if (data.length) {
                    if (data[0].password === req.body.password) {
                        var user = data[0];
                        //user is valid
                        var userToken = generateRandomString(20) + Date.now();
                        var id = user.ID;
                        console.log('==========ID=======:', id);
                        req.session.userId = id;
                        console.log('This is the ID ' + id);
                        var query = `INSERT INTO loggedInUsers SET userID=${user.ID}, token='${userToken}', created=NOW()`;
                        console.log("query is " + query);
                        connection.query(query, function (err) {
                            if (!err) {
                                res.set('Set-Cookie', 'userauth=' + userToken);
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
};
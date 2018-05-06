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
                var query = `SELECT * FROM loggedinUsers WHERE token='${auth}'`;
                console.log(query);
                connection.query(query, function (err, data) {
                    console.log(err, data);
                    if (!err) {
                        if (data.length) {
                            var id = data[0].userID;
                            var userID = id;
                            req.session.userId = userID;
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
        console.log('req.body', req.body);
        req.body.password = sha1(req.body.password);
        connection.connect(function (err) {
            console.log('db connected');
            connection.query(`SELECT user_id, password FROM users WHERE email = '${req.body.email}'`, function (err, data, fields) {
                console.log("data " , data);
                if (data.length) {
                    if (data[0].password === req.body.password) {
                        console.log('user_id',data[0].user_id);
                        var user = data[0];
                        var userID = data[0].user_id;
                        //user is valid
                        var userToken = generateRandomString(20) + Date.now();
                        req.session.userId = data[0].user_id;
                        
                        console.log('==========ID=======:', req.session.userId);

                        var query = `INSERT INTO loggedinUsers SET userID=${userID}, token='${userToken}', created=NOW()`;
                        console.log("query is " + query);
                        connection.query(query, function (err) {
                            if (!err) {
                                console.log(err);
                                res.set('Set-Cookie', 'userauth=' + userToken);
                                
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
                    console.log('user is invalid');
                    res.redirect("/")
                    
                }
            });
        })

    });
    //---------------------------------------END OF LOGIN CODE--------------------------------//
};
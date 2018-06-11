const mysql = require('mysql');
const credentials = require('../config/mysqlCredentials.js');
const connection = mysql.createConnection(credentials);
const sha1 = require('sha1');
// Verify if connection is successful
connection.connect((err) => {
  if (err) throw err;

  console.log('Connected to database yo')
});

module.exports = function (app) {
    app.get('/students', function (req, res) {
        var output = {
            success: false,
            errors: [],
            data: []
        };

        connection.query("SELECT first_name, first_name as doodah FROM users", function (err, results, fields) {
            if (!err) {
                output.success = true;
                output.data = results;
                output.fields = fields;

            } else {
                output.errors = err;
            }
            res.send(JSON.stringify(output));
        })
    });

    //------------------------ALL GET AND POST REQUESTTS--------------------------------------//
    // ==========GET ALL USERS===========//
    app.get('/userssql', (req, res, next) => {
        let query = 'SELECT * FROM ??';
        let inserts = ['users'];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });
    //==========END OF GET ALL USERS===========//

    //==========GET TODAY GOALS===========//
    app.post("/goalssqlday", (req, res, next) => {
        console.log("req: ", req.session.userId);
        if ("UserId==="+req.session.userId) {
            let userID = req.session.userId;
            let day = req.body.day;
            console.log("The day is ===="+day)
            let status = "active";
            let query = "SELECT * FROM ?? WHERE user_id = ? AND day = ? AND status = ? ORDER BY ??";
            console.log(query);
            let inserts = [
                "goals",
                userID,
                day,
                status,
                'timeframe',

            ];

            let sql = mysql.format(query, inserts);

            connection.query(sql, (err, results, fields) => {
                if (err) return next(err);

                const output = {
                    success: true,
                    data: results
                };
                res.json(output);
            });
        }
        else {
            res.json("no users logged in")
        }


    });

    //==========GET TOMORROW GOALS===========//
    app.get("/goalssqltmr", (req, res, next) => {
        console.log("req: ", req.session.userId);
        if (req.session.userId) {
            myFunction(req);

            function myFunction(req) {
                var d = new Date();
                var n = d.getDay();
                req.session.day = n;
                console.log("Day ======" + req.session.day);
            }

            let userID = req.session.userId;
            let day = req.session.day;
            let status = "active";
            let query = "SELECT * FROM ?? WHERE user_id = ? AND day = ? AND status = ?";
            console.log(query);
            let inserts = [
                "goals",
                userID,
                day,
                status
            ];

            let sql = mysql.format(query, inserts);

            connection.query(sql, (err, results, fields) => {
                if (err) return next(err);

                const output = {
                    success: true,
                    data: results
                };
                res.json(output);
            });
        }
        else {
            res.json("no users logged in")
        }


    });
  //==========END OF GET ALL USERS===========//

  //==========GET ALL GOALS===========//
  app.get("/goalssql", (req, res, next) => {
    console.log("req: ", req.session.userId);
      if(req.session.userId){
      // console.log('tried to enter query');
      let userID = req.session.userId;
          let query = "SELECT * FROM ?? WHERE user_id=? ORDER BY ??, ??";
          let inserts = [
              "goals",
              userID,
              'day',
              'timeframe',
          ];

          let sql = mysql.format(query, inserts);
          console.log('order', sql)
          connection.query(sql, (err, results, fields) => {
              if (err) return next(err);

                const output = {
                    success: true,
                    data: results
                };
                res.json(output);
            });
        }
        else {
            res.json("no users logged in")
        }


    });

    //==========END OF GET ALL GOALS===========//

    app.post("/goals", (req, res, next) => {
        let {goal, category, day, startdate, finishdate, timeframe} = req.body;
        let userID = req.session.userId;
        if(timeframe === null || undefined){
            timeframe = 'None';
        }
        let query = "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        console.log(query);
        let inserts = [
            "goals",
            "user_id",
            "goal",
            "category",
            "day",
            "startdate",
            "finishdate",
            "timeframe",
            "status",
            "stats",
            userID,
            goal,
            category,
            day,
            startdate,
            finishdate,
            timeframe,
            "active",
            0
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });

    //==========END OF POST GOALS===========//


    //==========POST USERS===========//
    app.post("/users", (req, res, next) => {
        let {email, username, password} = req.body;
        password = sha1(password);
        let query = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
        let inserts = [
            "users",
            "email",
            "username",
            "password",
            "status",
            email,
            username,
            password,
            0,
        ];
        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });

    //==========END OF POST USERS===========//

    //==========EDIT GOALS===========//
    app.post("/goals/update", (req, res, next) => {
        const {
            goal_id,
            goal,
        } = req.body;

        let query =
            "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        let inserts = [
            "goals",
            "goal",
            goal,
            "status",
            "active",
            "goal_id",
            goal_id
        ];
        console.log(query, inserts);
        let sql = mysql.format(query, inserts);
        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);
            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });
    //==========END OF EDIT GOALS===========//

    //==========COMPLETE/INCOMPLETE GOALS STATUS===========//
    app.post("/goals/update/complete", (req, res, next) => {
        var goal_id = req.body.goal_id;
        var stats = req.body.stats;
        console.log("This is the stats" + stats);

        let query =
            "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        let inserts = [
            "goals",
            "status",
            "Complete",
            "stats",
            stats,
            "goal_id",
            goal_id,
        ];
        console.log(query, inserts);
        let sql = mysql.format(query, inserts);
        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);
            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });

    app.post("/goals/update/incomplete", (req, res, next) => {
        var goal_id = req.body.goal_id;
        var stats = req.body.stats;
        console.log("This is the stats" + stats);

        let query =
            "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        let inserts = [
            "goals",
            "status",
            "Incomplete",
            "stats",
            stats,
            "goal_id",
            goal_id,
        ];
        console.log(query, inserts);
        let sql = mysql.format(query, inserts);
        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);
            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });
    //==========END OF EDIT GOALS STATUS===========//

    //==========EDIT GOALS===========//
    app.post("/users/update", (req, res, next) => {
        console.log(req.body);
        let userId = req.body.user_id;
        let matched_user_id = req.body.matched_user_id;
        // console.log("This is the user id for updating status" + userId);
        // console.log("This is the user id for updating status" + matched_user_id);
        let query =
            "UPDATE ?? SET ?? = 1 WHERE user_id = ? OR user_id = ?";
        let inserts = [
            "users",
            "status",
            userId,
            matched_user_id

        ];
        console.log(query, inserts);
        let sql = mysql.format(query, inserts);
        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);
            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });

  });


    //==========END OF EDIT GOALS===========//

    //==========DELETE GOALS===========//
    app.post("/goals/delete", (req, res, next) => {
        console.log("This is req.body.userID =========" + req.body.goal_id);
        const goal_id = req.body.goal_id;

        let query = "DELETE FROM ?? WHERE ?? = ?";
        let inserts = [
            "goals",
            "goal_id",
            goal_id
        ];
        console.log(query, inserts);
        let sql = mysql.format(query, inserts);
        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);
            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });

    //==========END OF EDIT GOALS===========//

    //----------------------------END OF POST AND GET REQUESTS--------------------------------------//

    //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    ///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//\/\/\/\/\/\/\/\/\/\/\/\

    //----------------------------------------MATCHING SYSTEM--------------------------------------//
    //==========GET ALL UNMATCHED USERS===========//
    app.post('/matching', (req, res, next) => {
        let userId = req.session.userId;
        let query = 'SELECT * FROM ?? WHERE status <> ? AND user_id <> ?';
        console.log(query);
        let inserts = [
            'users',
            1,
            userId
            // category, //Category they select on sign_up?
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results,
            };
            console.log(output.data);
            res.json(output);
        });
    });
    //==========END OF GET ALL UNMATCHED USERS===========//
    //==========GET ALL USERS WITH INTERESTED MATCHES===========//
    app.post('/interestedMatching', (req, res, next) => {
        let userId = req.session.userId;
        let query = 'SELECT * FROM ?? WHERE ?? = ?';
        console.log(userId);
        let inserts = [
            'interested_matches',
            'interested_user_id',
            userId
            // category, //Category they select on sign_up?
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results,
            };
            console.log(output.data);
            res.json(output);
        });
    });
    //==========END OF GET ALL INTERESTED MATCHES===========//
    //==========GET MATCHED USER GOALS===========//
    app.post('/matched', (req, res, next) => {
        let query = 'SELECT * FROM ?? WHERE user_id = ? OR matched_user_id = ?';
        let userId = req.session.userId;
        console.log('userID', userId);
        let inserts = [
            'matched_users',
            userId,
            userId
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results,
            };
            console.log("This is the output from matched" + output.data);
            res.json(output);
        });
    });
    //==========END OF GET ALL UNMATCHED USERS===========//

    //==========GET MATCHED USER GOALS===========//
    app.post('/matchedgoals', (req, res, next) => {
        let matchedUserId = req.body.matchedUser;
        let userId = req.body.userId;
        let day = req.body.day;
        console.log("This is day" + day);
        console.log(matchedUserId, userId);
        if(matchedUserId == req.session.userId){
            userId = req.body.matchedUserId;
            matchedUserId = req.body.userId;
            console.log("we hit the if Check")
        }
        console.log("This is the matched userId " + matchedUserId);
        let query = 'SELECT * FROM ?? WHERE user_id = ? AND day = ?';
        let inserts = [
            'goals',
            matchedUserId,
            day,
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results,
            };
            console.log("Output Data" + output.data);
            res.json(output);
        });
    });
    //==========END OF GET ALL UNMATCHED USERS===========//

    //==========GET MATCHED USER USERNAME===========//
    app.post('/getMatchedUsername', (req, res, next) => {
        let matchedUserId = req.body.matchedUser;
        let userId = req.body.userId;
        console.log(matchedUserId, userId);
        if(matchedUserId == req.session.userId){
            userId = req.body.matchedUserId;
            matchedUserId = req.body.userId;
            console.log("we hit the if Check")
        }
        console.log("This is the matched userId " + matchedUserId);
        let query = 'SELECT * FROM ?? WHERE user_id = ?';
        let inserts = [
            'users',
            matchedUserId,
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results,
            };
            console.log("Output Data" + output.data);
            res.json(output);
        });
    });
    //==========END OF GET MATCHED USER USERNAME===========//

    //==========POST POSSIBLE MATCHES TO INTERESTED_MATCHES===========//
    app.post("/matchingusers", (req, res, next) => {
        let matchedUserId = req.body.matchedUserId;
        let userName = req.body.username;
        console.log(req.session.userId);
        console.log("This is the matched UserID:"+ matchedUserId);
        let userId = req.session.userId;
        let query = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
        let inserts = [
            "interested_matches",
            "user_id",
            "interested_user_id",
            "username",
            userId, // There student Id
            matchedUserId, //User they clicked on
            userName
        ];
        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });

    // function sendData(userId, matchedUserId) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/users",
    //         // dataType: "json",
    //         data: {
    //             userId: userId,
    //             matchedUserId: matchedUserId,
    //         },
    //         success: function (json_data) {
    //             var data = json_data;
    //             console.log(data);
    //         }
    //
    //     })
    // }


//==========END OF POST POSSIBLE MATCHES TO INTERESTED_MATCHES===========//

// ==========GRAB ALL USERS THAT MATCHED WITH EACH OTHER===========//
    app.post('/matchingpairs', (req, res, next) => {
        let {matchedUserId} = req.body;
        let userId =req.session.userId;
        if(matchedUserId == req.session.userId){
            userId = req.body.matchedUserId;
            matchedUserId = req.body.userId;
            console.log("we hit the if Check")
        }
        console.log(userId);
        console.log(matchedUserId);
        let query = 'SELECT A.user_id, A.`interested_user_id`,\n' +
            'b.user_id AS user_id2,\n' +
            'b.`interested_user_id`\n' +
            'FROM interested_matches AS A, \n' +
            '\t interested_matches AS b\n' +
            'WHERE A.user_id = ? AND b.user_id = ? AND A.interested_user_id = ? AND b.interested_user_id = ?';


        let inserts = [
            userId,
            matchedUserId,
            matchedUserId,
            userId,
        ];

        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });
// ==========END OF USERS THAT MATCHED WITH EACH OTHER===========//
    //==========POST MATCHES TO MATCHED_USERS===========//
    app.post("/matchedusers", (req, res, next) => {
        debugger;
        var user_id = req.session.userId;
        var matched_user_id = req.body.matched_user_id;
        console.log(req.body);
        let query = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
        let inserts = [
            "matched_users",
            "user_id",
            "matched_user_id",
            user_id, // There student Id
            matched_user_id, //User they clicked on
        ];
        let sql = mysql.format(query, inserts);

        connection.query(sql, (err, results, fields) => {
            if (err) return next(err);

            const output = {
                success: true,
                data: results
            };
            res.json(output);
        });
    });

    // function sendData(userId, matchedUserId) {
    //     $.ajax({
    //         type: "POST",
    //         url: "/matchedusers",
    //         // dataType: "json",
    //         data: {
    //             userId: userId,
    //             matchedUserId: matchedUserId,
    //         },
    //         success: function (json_data) {
    //             var data = json_data;
    //             console.log(data);
    //         }
    //
    //     })
    // }


//====================END OF POST MATCHES TO MATCHED_USERS===========//

};

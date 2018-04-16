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

    //==========GET ALL GOALS===========//
    app.get("/goalssqlday", (req, res, next) => {
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
              'timeframe',
              'goal'
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
    //==========GET ALL GOALS BY GOAL ID===========//

    // app.get('/goalssql', (req, res, next) => {
    //   console.log("req: ", req.session)
    //     return;


    // let { userID } = id;
    // console.log("These are the params", id);
    //
    // let query = "SELECT * FROM ?? WHERE ?? = ?";
    // let inserts = ["goals", "userID", userID];
    // console.log("inserts are: ", inserts);
    // let sql = mysql.format(query, inserts);

    // connection.query(sql, (err, results, fields) => {
    //   if (err) return next(err);
    //
    //   const output = {
    //     success: true,
    //     data: results
    //   };
    //   res.json(output);
    // });
    // });

    //==========END OF GET ALL GOALS===========//

    //==========POST GOALS===========//
    app.post("/goals", (req, res, next) => {
        const {goal, day, startdate, finishdate, timeframe, status} = req.body;
        let userID = req.session.userId;
        let query = "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)";
        console.log(query);
        let inserts = [
            "goals",
            "user_id",
            "goal",
            "day",
            "startdate",
            "finishdate",
            "timeframe",
            "status",
            userID,
            goal,
            day,
            startdate,
            finishdate,
            timeframe,
            status,
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
            "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let inserts = [
            "goals",
            "goal",
            goal,
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

    //==========EDIT GOALS STATUS===========//
    app.post("/goals/update/status", (req, res, next) => {
        const {
            goal_id,
        } = req.body;

        let query =
            "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let inserts = [
            "goals",
            "status",
            "Complete",
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
            "UPDATE ?? SET ?? = 1 WHERE id = ? OR id = ?";
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
        let query = 'SELECT * FROM ?? WHERE status <> ? AND id <> ?';
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
        console.log("This is req.session.UserId" + req.session.userId);
        console.log(matchedUserId, userId);
        if(matchedUserId == req.session.userId){
             userId = req.body.matchedUserId;
             matchedUserId = req.body.userId;
             console.log("we hit the if Check")
        }
        console.log("This is the matched userId " + matchedUserId);
        let query = 'SELECT * FROM ?? WHERE user_id = ?';
        let inserts = [
            'goals',
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
    //==========END OF GET ALL UNMATCHED USERS===========//

    //==========POST POSSIBLE MATCHES TO INTERESTED_MATCHES===========//
    app.post("/matchingusers", (req, res, next) => {
        let matchedUserId = req.body.matchedUserId;
        console.log(req.session.userId);
        console.log("This is the matched UserID:"+ matchedUserId);
        let userId = req.session.userId;
        let query = "INSERT INTO ?? (??, ??) VALUES (?, ?)";
        let inserts = [
            "interested_matches",
            "user_id",
            "interested_user_id",
            userId, // There student Id
            matchedUserId, //User they clicked on
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
        console.log(userId);
        console.log(matchedUserId);
        let query = 'SELECT A.user_id, A.`interested_user_id`,\n' +
            'b.user_id AS user_id2,\n' +
            'b.`interested_user_id`\n' +
            'FROM interested_matches AS A, \n' +
            '\t interested_matches AS b\n' +
            'WHERE A.user_id = b.`interested_user_id`\n' +
            'AND A.user_id <> b.user_id';
        let inserts = [
            'interested_matches',
            userId, //User id of first user trying to find match
            matchedUserId, //User id of person they want to match
            matchedUserId, //User id of second person trying to find match
            userId // User id of person they want to match
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

    function sendData(userId, matchedUserId) {
        $.ajax({
            type: "POST",
            url: "/matchedusers",
            // dataType: "json",
            data: {
                userId: userId,
                matchedUserId: matchedUserId,
            },
            success: function (json_data) {
                var data = json_data;
                console.log(data);
            }

        })
    }


//====================END OF POST MATCHES TO MATCHED_USERS===========//

};
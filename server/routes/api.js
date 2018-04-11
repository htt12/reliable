const mysql = require('mysql');
const credentials = require('../config/mysqlCredentials.js');
const connection = mysql.createConnection(credentials);

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
  app.get("/goalssql", (req, res, next) => {
    console.log("req: ", req.session.userId);
      if(req.session.userId){
      console.log('tried to enter query');
      let userID = req.session.userId;
          let query = "SELECT * FROM ?? WHERE userID = ?";
          let inserts = ["goals", userID];

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
      else{
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
    const { goal, day, startdate, finishdate, timeframe } = req.body;

    let query = "INSERT INTO ?? (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)";
    let inserts = [
      "goals",
      "goal",
      "day",
      "startdate",
      "finishdate",
      "timeframe",
      goal,
      day,
      startdate,
      finishdate,
      timeframe
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
    let { email, username, password } = req.body;
    password = sha1(password);
    let query = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
    let inserts = [
      "users",
      "email",
      "username",
      "password",
      email,
      username,
      password
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
      userID,
      goal,
      day,
      startdate,
      finishdate,
      timeframe
    } = req.body;

    let query =
      "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
    let inserts = [
      "goals",
      "userID",
      userID,
      "goal",
      goal,
      "day",
      day,
      "startdate",
      startdate,
      "finishdate",
      finishdate,
      "timeframe",
      timeframe,
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

  //==========DELETE GOALS===========//
  app.post("/goals/delete", (req, res, next) => {
    const { goal_id } = req.body;

    let query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = ["goals", "goal_id", 50, "goal_id", goal_id];
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
};

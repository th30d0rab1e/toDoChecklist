var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  database: 'antares', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time?
  idleTimeoutMillis: 30000 // 30 second time out
};

// var pool = new pg.Pool(config);
var poolModule = require('./modules/pool.js');
var pool = poolModule;
var port = process.env.PORT || 5000;
// Using a router drops the part of the url used to get here
// http://localhost:5000/books/ would '/'
router.get('/', function(req, res){
  // errorConnecting is bool, db is what we query against,
  // done is a function that we call when we're done
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now we're going to GET things from the db
      var queryText = 'SELECT * FROM "checklist";';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.send({lists: result.rows});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of GET

router.post('/', function(req, res) {
  var list = req.body;
  console.log(list);
  // PASTED PG CODE
  // errorConnecting is bool, db is what we query against,
  // done is a function that we call when we're done
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now we're going to GET things from the db
      var queryText = 'INSERT INTO "checklist" ("whattodo", "complete")' +
                      ' VALUES ($1, $2);';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [list.input, list.complete], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
});

// PUT is similar to POST when using PG
router.put('/', function(req, res){
  var list = req.body; // Book with updated content


  // YOUR CODE HERE
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now we're going to GET things from the db
      var queryText = 'UPDATE "checklist" set "complete" = $1' +
                      ' WHERE "id" = $2;';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [list.complete, list.id], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }) // end pool
});

// http://localhost:5000/books/5
// ^ Delete book with the id of 5
// DELETE is similar to GET when using PG
router.delete('/:id', function(req, res){
  var id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);

  // YOUR CODE HERE
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      // We connected to the database!!!
      // Now we're going to GET things from the db
      var queryText = 'DELETE FROM "checklist" WHERE "id" = $1;';
      // errorMakingQuery is a bool, result is an object
      db.query(queryText, [id] ,function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          // console.log(result);
          // Send back the results
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }) // end pool
});

module.exports = router;

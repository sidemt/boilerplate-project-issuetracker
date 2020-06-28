/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  // MongoClient.connect(CONNECTION_STRING, (err, client) =>{
  //   db = client.db('issue-tracker');
  //   if (err) {
  //     console.error("Database error: ", err);
  //   } else {
  //     console.log("Successful database connection");

      app.route('/api/issues/').get(function (req, res){
        var project = req.params.project;
        console.log('GET');
        return res.json({res: 'get request'});
      });

      app.route('/api/issues/:project')
      .post(function (req, res){
        var project = req.params.project;
        console.log('POST');
        console.log(project);
        console.log(req.body);
        db.collection('issues').insert(
          {
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text
          }
        );
        return res.json({created: "created!"})
      })

      // .put(function (req, res){
      //   var project = req.params.project;

      // })
      // .delete(function (req, res){
      //   var project = req.params.project;

      // });


  //   }
  // });
};

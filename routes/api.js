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

  app.route('/api/issues/:project').get(function (req, res){
    var project = req.params.project;
    console.log('GET');
    // db.collection("issues").find({ project: project }, (err, doc) => {
    //   while(doc.hasNext()) {
    //     console.log(doc.next());
    //   }

    //   return res.json({get: 'get'});
    // });
  })
  .post(function (req, res){
    console.log('POST');
    var project = req.params.project;

    if (req.body.issue_title && req.body.issue_text && req.body.created_by) { // These are required fields
      let now = (new Date()).toISOString(); // "2020-06-28T05:13:02.933Z" format
      db.collection('issues').insert( // Save to mongoDB
        {
          project: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: (typeof req.body.assigned_to === 'undefined' ? '' : req.body.assigned_to), // optional
          status_text: (typeof req.body.status_text === 'undefined' ? '' : req.body.status_text), // optional
          created_on: now,
          updated_on: now,
          open: true
        }, (err, writeResult) => {
          // console.log(writeResult);
          if (writeResult.result.ok === 1) {
            // Successfully saved to DB
            return res.json({
              issue_title: writeResult.ops[0].issue_title,
              issue_text: writeResult.ops[0].issue_text,
              created_by: writeResult.ops[0].created_by,
              assigned_to: writeResult.ops[0].assigned_to,
              status_text: writeResult.ops[0].status_text,
              created_on: writeResult.ops[0].created_on,
              updated_on: writeResult.ops[0].updated_on,
              open: writeResult.ops[0].open,
              _id: writeResult.ops[0]._id
            })
          } else {
            // DB error
            console.error(writeResult.writeError);
            return res.send("DB write error");
          }
        }
      );

    } else {
      // Some of required fields are missing
      console.log('some values are missing');
      return res.send('missing inputs');
    }
  })
  .put(function (req, res){
    var project = req.params.project;

    if (req.body._id) { // These are required fields
      let now = (new Date()).toISOString(); // "2020-06-28T05:13:02.933Z" format
      let updateObj = {};
      // console.log('body', req.body);

      for (const [key, value] of Object.entries(req.body)) {
        if (value.length > 0) {
          updateObj[key] = value
        }
      }
      updateObj['updated_on'] = now; // Update updated_on date
      console.log(updateObj);

      db.collection('issues').findAndModify( // Save to mongoDB
        {_id: req.body._id }, // query
        {}, // sort
        updateObj,
        { upsert: true, new: true },
        (err, doc) => {
          if (err) {
            console.error('DB error returned: ', err);
            return res.send('could not update ' + req.body._id)
          } else {
            // console.log(doc);

            return res.send('successfully updated')

          }
        }
      );
    } else {
      // _id is missing
      return res.send('no updated field sent')
    }
  })
  .delete(function (req, res){
    console.log('DELETE');
    var project = req.params.project;
    // console.log(req.body);

    if (req.body._id) { // These are required fields
      let now = (new Date()).toISOString(); // "2020-06-28T05:13:02.933Z" format

      db.collection('issues').deleteOne( // Save to mongoDB
        {_id: req.body._id }, // query
        {},
        (err, doc) => {
          if (err) {
            console.error('DB error returned: ', err);
            return res.send('could not delete ' + req.body._id)
          } else {
            console.log('Successfully deleted');
            // console.log(doc);

            return res.send('deleted ' + req.body._id);

          }
        }
      );
    } else {
      // _id is missing
      return res.send('_id error')
    }
  });

};

/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/

          //fill me in too!
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');

          // Also include
          assert.match(res.body.created_on, dateRegex);
          assert.match(res.body.updated_on, dateRegex);
          assert.equal(res.body.open, true);
          assert.isNotEmpty(res.body["_id"]);

          done();
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/

          //fill me in too!
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.isEmpty(res.body.assigned_to); // blank for optional no input
          assert.isEmpty(res.body.status_text); // blank for optional no input

          // Also include
          assert.match(res.body.created_on, dateRegex);
          assert.match(res.body.updated_on, dateRegex);
          assert.equal(res.body.open, true);
          assert.isNotEmpty(res.body["_id"]);

          done();
        });
      });

      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(res.body, 'missing inputs');

          done();
        });
      });

    });

    suite('PUT /api/issues/{project} => text', function() {

      test('No body', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send() // No body
        .end(function(err, res){
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(res.body, 'missing inputs');

          done();
        });
      });

      test('One field to update', function(done) {
        // Create an issue
        // chai.request(server)
        // .post('/api/issues/test')
        // .send({
        //   issue_title: 'Title',
        //   issue_text: 'text',
        //   created_by: 'Functional Test - Every field filled in',
        //   assigned_to: 'Chai and Mocha',
        //   status_text: 'In QA'
        // })
        // .end(function(err, res){
        //   assert.equal(res.status, 200);
        // });

        chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_title: 'Title Updated'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(res.body.issue_title, 'Title Updated');

          done();
        });
      });

      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_title: 'Title Updated',
          open: false
        })
        .end(function(err, res){
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(res.body.issue_title, 'Title Updated');
          assert.equal(res.body.open, false);

          done();
        });
      });

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');

          assert.equal(res.body[0].issue_title, 'Title');
          done();
        });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title Updated',
                open: false })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');

          assert.equal(res.body[0].issue_title, 'Title Updated');
          assert.equal(res.body[0].open, false);
          done();
        });
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {

      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send() // without _id
        .end(function(err, res){
          assert.equal(res.status, 200);

          //fill me in too!
          assert.equal(res.body, '_id error');

          done();
        });
      });

      test('Valid _id', function(done) {
        let valid_id;
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          valid_id = res.body[0]["_id"];
        });

        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: valid_id })
        .end(function(err, res){
          assert.equal(res.status, 200);

          let expected_response = 'deleted ' + valid_id;

          //fill me in too!
          assert.equal(res.body, expected_response);

          done();
        });
      });

    });

});

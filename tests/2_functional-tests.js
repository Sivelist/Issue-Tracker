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
          assert.equal(res.body.issue_title, 'Title');
         assert.equal(res.body.issue_text, 'text');
         assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
         assert.equal(res.body.assigned_to, 'Chai and Mocha');
         assert.equal(res.body.status_text, 'In QA');
          //fill me in too!
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
          assert.equal(res.body.issue_title, 'Title');
         assert.equal(res.body.issue_text, 'text');
         assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
         assert.equal(res.body.assigned_to, null);
         assert.equal(res.body.status_text, null);
          //fill me in too!
          done();
        });
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, null);
         assert.equal(res.body.issue_text, null);
         assert.equal(res.body.created_by, null);
         assert.equal(res.body.assigned_to, null);
         assert.equal(res.body.status_text, null);
         assert.equal(res.text, 'Please fill in required fields')
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id:'5d1e33694e1ad20b0147a355',
          issue_title: undefined,
          issue_text: undefined,
          created_by: undefined,
          assigned_to: undefined,
          status_text: undefined
        })
        .end(function(err, res){
         // var currentDate = new Date(Date.now());
         // console.log(currentDate);
         // console.log(res.body.updated_on);
          assert.equal(res.status, 200);
         // assert.equal(res.body.updated_on, currentDate); // due to the time lag of running the script this will never match. you can convert to unix time and use approximate but would have to get the value from database as res.body.updated_on is undefined
         assert.equal(res.text, 'successfully updated');
          done();
        });
      });
      
      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id:'5d1e33694e1ad20b0147a355',
          issue_title: 'undefined',
          issue_text: undefined,
          created_by: undefined,
          assigned_to: undefined,
          status_text: undefined
        })
        .end(function(err, res){

          assert.equal(res.status, 200);
         assert.equal(res.text, 'successfully updated');
          done();
        });
        
        
        
      });
      
      test('Multiple fields to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id:'5d1e33694e1ad20b0147a355',
          issue_title: 'undefined',
          issue_text: undefined,
          created_by: 'undefined',
          assigned_to: undefined,
          status_text: 'undefined'
        })
        .end(function(err, res){

          assert.equal(res.status, 200);
         assert.equal(res.text, 'successfully updated');
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
          // console.log(res.body);
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
        .query({issue_title: 'issue with api'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          // console.log(res.body);
          assert.propertyVal(res.body[0], 'issue_title', 'issue with api');
          assert.propertyVal(res.body[0], 'issue_text', 'issue with api');
          assert.propertyVal(res.body[0], 'created_on', '2019-07-04T17:16:15.605Z');
          // assert.propertyVal(res.body[0], 'updated_on');
          assert.propertyVal(res.body[0], 'created_by', 'Me');
          assert.propertyVal(res.body[0], 'assigned_to', '');
          assert.propertyVal(res.body[0], 'open', true);
          assert.propertyVal(res.body[0], 'status_text', '');
          assert.propertyVal(res.body[0], '_id', '5d1e345f459f2c0d0a9cef14');
          done();
        });

      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'issue with api', issue_text: 'issue with api'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          // console.log(res.body);
          assert.propertyVal(res.body[0], 'issue_title', 'issue with api');
          assert.propertyVal(res.body[0], 'issue_text', 'issue with api');
          assert.propertyVal(res.body[0], 'created_on', '2019-07-04T17:16:15.605Z');
          // assert.propertyVal(res.body[0], 'updated_on');
          assert.propertyVal(res.body[0], 'created_by', 'Me');
          assert.propertyVal(res.body[0], 'assigned_to', '');
          assert.propertyVal(res.body[0], 'open', true);
          assert.propertyVal(res.body[0], 'status_text', '');
          assert.propertyVal(res.body[0], '_id', '5d1e345f459f2c0d0a9cef14');
          done();
        });
        
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: ''})
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'could not delete ');

          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id: '5d1e336a4e1ad20b0147a356'})
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted 5d1e336a4e1ad20b0147a356');

          done();
        });
      });
      
    });

});

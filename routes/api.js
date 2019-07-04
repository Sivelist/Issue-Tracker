/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');

const CONNECTION_STRING = process.env.DB; 

// mongoose.connect(CONNECTION_STRING);


module.exports = function (app,db) {


    
  
      app.route('/api/issues/:project')    // :project just takes whatever is after /api/issues/XXXXXX as project (ie XXXXXX => project name)
          
        .get(function (req, res){
          var project = req.params.project;
          var queryId = req.query._id;
          var queryIssueTitle = req.query.issue_title;
          var queryIssueText = req.query.issue_text;
          var queryCreateDate = req.query.created_on;
          var queryUpdateDate = req.query.updated_on;
          var queryCreator = req.query.created_by;
          var queryAssignment = req.query.assigned_to;
          var queryOpen = req.query.open;
          var queryStatus = req.query.status_text;
          var queryArray = [queryId, queryIssueTitle, queryIssueText, queryCreateDate, queryUpdateDate, queryCreator, queryAssignment, queryOpen, queryStatus];
          var queryTitle = ['_id', 'issue_title', 'issue_text', 'created_on', 'updated_on', 'created_by', 'assigned_to', 'open', 'status_text'];
          var tempObj = {};
          // console.log(queryOpen);
        
          if(queryArray.every((x)=>{return x == undefined}) == true){
            // console.log(queryArray.indexOf(!undefined));
            // console.log(queryOpen);
          db.db('test').collection('apitest').find({}).toArray((err,result)=>{
                                                               // console.log(result);
                                                               res.json(result);
                                                               });
          // console.log('test1');  
        }else{
          // console.log('test2');
          for(var i = 0; i < queryArray.length; i++){
            if(queryArray[i] !== undefined){
              if(i==7){                              //special case for the boolean
                if(queryArray[i] == 'false'){
                  queryArray[i] = false;
                }else{
                  queryArray[i] = true;
                }
              }
              var tempTitleObj = new Object;
              tempTitleObj[queryTitle[i]] = queryArray[i];
              tempObj = Object.assign({}, tempObj, tempTitleObj);
              // console.log(tempObj);
            }
          }
              db.db('test').collection('apitest').find(tempObj).toArray((err,result)=>{
                                                                             // console.log(result);
                                                                             res.json(result);
                                                                             });
          
        }
        })

  
        .post(function (req, res){
          var project = req.params.project;
          var currentDate = new Date(Date.now());
          var createIssue = {issue_title: req.body.issue_title,
           issue_text: req.body.issue_text,
           created_on: currentDate,
           updated_on: currentDate,
           created_by: req.body.created_by,
           assigned_to: req.body.assigned_to,
           open: true,
           status_text: req.body.status_text
          };
          // console.log("button is pressed");
        
          if(req.body.issue_text == undefined || req.body.issue_title == undefined || req.body.created_by == undefined){
            res.send('Please fill in required fields');
            
          }else{
          db.db("test").collection("apitest").insertOne(
            createIssue
          );
          res.json(createIssue);
          }
        })

        .put(function (req, res){
          var project = req.params.project;
          var temp = req.body._id;
          var title = req.body.issue_title;
          var text = req.body.issue_text; 
          var creator = req.body.created_by;
          var assignment = req.body.assigned_to;
          var status = req.body.status_text;
          var checkBox = req.body.open;
          var currentDate = new Date(Date.now());
          // console.log(temp.length);
        
        
        try{
          db.db('test').collection('apitest').findOne({_id: ObjectId(temp)}, (err,result)=>{
            if (err) {
              console.log('error');
            }else if(result == null){
              res.send('could not update ' + req.body._id);
            }else{
              
              // if(title == '' && text == '' && creator == '' && assignment == '' && status == '' && checkBox == undefined){
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {updated_on: currentDate}});
              
              
              if(title !== '' && title !== undefined && title !== null){
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {issue_title: title}});
              }
              
              if(text !== '' && text !== undefined && text !== null){
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {issue_text: text}});
              }
              
              if(creator !== '' && creator !== undefined && creator !== null){
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {created_by: creator}});
              }
              
              if(assignment !== '' && assignment !== undefined && assignment !== null){
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {assigned_to: assignment}});
              }
              
              if(status !== '' && status !== undefined && status !== null){
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {status_text: status}});
              }
              
              if(checkBox == 'false'){
                // console.log("test");
                db.db('test').collection('apitest').updateOne({_id: ObjectId(temp)},{$set: {open: false}});
              }
              
              // console.log(req.body.open);
              
              res.send('successfully updated');
              
            }
          });
          } catch (e) {
            if (e instanceof Error){
              res.send('could not update ' + req.body._id);
            }
          }
        })

        .delete(function (req, res){
          var project = req.params.project;
          var temp = req.body._id;
        
           // console.log('delete button pressed');
        
          try{
              db.db('test').collection('apitest').findOne({_id: ObjectId(temp)}, (err,result)=>{
                if (err) {
                  console.log('error');
                }else if(result == null){
                  res.send('_id error');
                }else{
                  db.db('test').collection('apitest').deleteOne({_id: ObjectId(temp)});
                  res.send('deleted ' + temp);
                }
              });
              } catch (e) {
                if (e instanceof Error){
                  res.send('could not delete ' + req.body._id);
                }
              }
        });
    

  
  
};
    
  

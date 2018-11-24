 //Mongo client lets u to connect to a mongo server and manipulate a mongo db
 //var MongoClient = require('mongodb').MongoClient;
 var {MongoClient,ObjectID} = require('mongodb');
 MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
     if(err){
         return console.log('Unable to connect to mongoDb server')
     }
     db.collection('Todos').findOneAndUpdate({_id: new ObjectID('5bf9040008979d08587f6f69')},{
         $set:{
             text: 'Update Todo'
         }
     },{
         returnOriginal: false
     }).then((res)=>{
         console.log(res);
     });
 });

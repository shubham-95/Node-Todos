 //Mongo client lets u to connect to a mongo server and manipulate a mongo db
 //var MongoClient = require('mongodb').MongoClient;
 var {MongoClient,ObjectID} = require('mongodb');
 MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
     if(err){
         return console.log('Unable to connect to mongoDb server')
     }
    // db.collection('Todos').find().count()
    // .then((count)=>{
    //     console.log('Response',count);
    // },(err)=>{
    //     console.log('Getting error',err);
    // })


    db.collection('Users').find({name:"Shubham"}).toArray()
    .then((docs)=>{
        console.log('Response',JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log('Getting error',err);
    })

 });

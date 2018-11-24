 //Mongo client lets u to connect to a mongo server and manipulate a mongo db
 //var MongoClient = require('mongodb').MongoClient;
 var {MongoClient} = require('mongodb');
 MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
     if(err){
         return console.log('Unable to connect to mongoDb server')
     }
     console.log('Connected to mongodb');

    //  db.collection('Todos').insertOne({
    //      text: 'Second Todo',
    //      completed:false
    //  },(err,result)=>{
    //      if(err){
    //          return console.log("Giving Error");
    //      }
    //      console.log(JSON.stringify(result.ops,undefined,2));
    //  });

    db.collection('Users').insertOne({
        name: "Shubham Shukla",
        age: "23",
        location: "Jaipur"
    },(err,result)=>{
        if(err){
            return console.log(err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
     db.close();

    // db.collection('Todos').fetch().toArray().then((docs)=>{
    //     console.log('Response',JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Getting error',err);
    // });
 });

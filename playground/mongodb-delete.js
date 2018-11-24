 //Mongo client lets u to connect to a mongo server and manipulate a mongo db
 //var MongoClient = require('mongodb').MongoClient;
 var {MongoClient,ObjectID} = require('mongodb');
 MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
     if(err){
         return console.log('Unable to connect to mongoDb server')
     }

    //  db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((res)=>{
    //      console.log(res);
    //  });

    //  db.collection('Users').deleteMany({name: 'Shubham'}).then((res)=>{
    //      console.log("Response",res);
    //  },(err)=>{
    //     console.log(err);
    // });

     db.collection('Users').findOneAndDelete({_id:new ObjectID('5bf90c4066218f10f8bc6bf8')}).then((res)=>{
         console.log("Response",res);
     },(err)=>{
        console.log(err);
    });
 });

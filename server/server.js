var express=require('express');
var bodyParser=require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var newTodos = new Todo({
        text:req.body.text
    });
    newTodos.save().then((result)=>{
        res.send(result); 
    }).catch((err)=>{
        res.status(400).send(err);
    });
});
app.get('/getTodos',(req,res)=>{
   Todo.find().then((docs)=>{
       res.send(docs)
   }).catch((err)=>{
       res.status(400).send(err);
   }) ;
});

app.get('/todos/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findById(req.params.id).then((todo)=>{
        if(!todo){
            return res.status(404).send();    
        }
        res.status(200).send(todo);
        
    })
    .catch((err)=>{
        res.status(404).send();
    });
});

app.listen(3000,(res)=>{
    console.log('listening on port 3000');
}); 
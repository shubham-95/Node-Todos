require('./config/config');
const _ =require('lodash');
var express=require('express');
var bodyParser=require('body-parser');
var multer = require('multer');
var upload = multer();

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(upload.array()); 


const port = process.env.PORT;

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
app.delete('/deleteTodos/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('Not Valid id');
    }
    Todo.findOneAndRemove({_id:req.params.id}).then((todo)=>{
        if(!todo){
            return res.status(400).send("Not a valid id");
        }
        else{
            res.status(200).send(todo);
        }
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.patch('/updateTodos/:id',(req,res)=>{
    var id= req.params.id;
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid id');
    }

    if(_.isString(body.completed) && body.completed === 'true'){    
        body.completedAt=new Date().getTime();
    }
    else{
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(400).send('invalid id');
        }
        res.status(200).send(todo);
    })
    .catch((err)=>{
        res.status(400).send('invalid id');
    });
});

app.listen(port,(res)=>{
    console.log(`listening on port ${port}`);
}); 
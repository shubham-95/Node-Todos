var express=require('express');
var bodyParser=require('body-parser');


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

});

app.listen(3000,(res)=>{
    console.log('listening on port 3000');
}); 
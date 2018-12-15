require('./config/config');
const _ =require('lodash');
var express=require('express');
var bodyParser=require('body-parser');
var multer = require('multer');
var upload = multer();

const {ObjectID} = require('mongodb');
const bcrypt=require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(upload.array()); 


const port = process.env.PORT 

app.post('/todos',authenticate,(req,res)=>{
    var newTodos = new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
    
    newTodos.save().then((result)=>{
        res.send(result); 
    }).catch((err)=>{
        res.status(400).send(err);
    });
});
app.get('/getTodos',authenticate,(req,res)=>{
   Todo.find({_creator:req.user._id}).then((docs)=>{
       res.send(docs)
   }).catch((err)=>{
       res.status(400).send(err);
   }) ;
});

app.get('/todos/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findOne({_id:req.params.id,_creator:req.user._id}).then((todo)=>{
        if(!todo){
            return res.status(404).send();    
        }
        res.status(200).send(todo);
        
    })
    .catch((err)=>{
        res.status(404).send();
    });
});
app.delete('/deleteTodos/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send('Not Valid id');
    }
    Todo.findOneAndRemove({_id:req.params.id,_creator:req.user._id}).then((todo)=>{
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

app.patch('/updateTodos/:id',authenticate,(req,res)=>{
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

    Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(400).send('invalid id');
        }
        res.status(200).send(todo);
    })
    .catch((err)=>{
        res.status(400).send('invalid id');
    });
});


app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var newUser = new User(body);
    //console.log('id',newUser._id);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();
    })
    .then((token)=>{
        res.header('x-auth',token).send(newUser);        
    })
    .catch((error)=>{
        res.status(404).send(error);
    });
});


app.get('/users/userDetails',authenticate,(req,res)=>{
    res.send(req.user);
});


app.post('/api/v1/todos/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);

    User.login(body.email,body.password).then((user)=>{
        //res.status(200).send(user);
        return user.generateAuthToken().then((token)=>{
            res.status(200).header('x-auth',token).send(user);
        });
    })
    .catch((err)=>{
        res.status(400).send();
    });

});
app.delete('/api/v1/todos/delete',(req,res)=>{
    var body = _.pick(req.body,['email']);
    User.deleteUser(body.email).then((user)=>{
        res.status(200).send(user);
    }).catch((err)=>{
        //console.log(err);
        res.status(400).send();
    });
});

app.delete('/api/v1/todos/logout',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    })
    .catch((err)=>{
        res.status(400).send();
    })
});

app.listen(port,(res)=>{
    console.log(`listening on port ${port}`);
}); 
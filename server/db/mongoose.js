var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');




// var newTodo = new Todo({
//     text: '  Testing Todos  '
// });
// newTodo.save().then((res)=>{
//     console.log(`saved Todo ${res}`);
// }).catch((err)=>{
//     console.log(err);
// });

 

// var newUser = new User({
//     email: 'shubhamsharma032gmail.com'
// });
// newUser.save().then((res)=>{
//     console.log(res);
// })
// .catch((err)=>{
//     console.log(err);
// });

module.exports={mongoose};
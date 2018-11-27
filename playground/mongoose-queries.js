const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

var id = '5bf93a40dcb8840e0c7ced2d112';


if(!ObjectID.isValid(id)){
    return console.log('Id not valid');
}


User.findById(id).then((doc)=>{
    if(!doc){
        return console.log('Id not found');
    }
    console.log('Result',doc.email);
})
.catch((err)=>{
    console.log(err);
});
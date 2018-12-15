const mongoose = require('mongoose');
const validator = require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = mongoose.Schema({
    email:{
        type:String,
        trim:true,
        minlength:1,
        require:true,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'{VALUE} is not a valid email'
        }        
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
});

// instance methods and static methods have a major difference that static are use with models and instance are used with documents. Instance should not access to whole documents that doesn't make any sense. 
UserSchema.methods.generateAuthToken = function () {
    var user=this;
    var access='auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    console.log('token',token);
    user.tokens.push({access,token});

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.methods.toJSON = function (){
    var user=this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
}

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token,'abc123');
    } catch (error) {
        return new Promise((resolve,reject)=>{
            reject();
        });
     }
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth' 
    }); 
};

var User=mongoose.model('User',UserSchema);

module.exports={User}
const mongoose = require('mongoose');
const validator = require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');
const bcrypt=require('bcryptjs');

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
    if(user.tokens.length!=0){
        user.tokens.splice(0,1,{access,token});
    }
    else{
        user.tokens.push({access,token});
    }

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

UserSchema.statics.login = function(email,password){
    var User = this;
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    resolve(user);
                }
                else{
                    reject();
                }
            });
        });
    })
    .catch((err)=>{
        return Promise.reject();
    });
};

UserSchema.statics.deleteUser = function(email){
    var User = this;
    return User.findOneAndDelete({email}).then((user)=>{
        if(!user){
            return Promise.reject('User not found');
        }
        return Promise.resolve(user);
    })
    .catch((err)=>{
        return Promise.reject('Error occured');
    });
};


UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }      
});

// we are using pull method of mongodb to pull out our token from user array;
UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull:{
            tokens:{token}
        }
    });
};

var User=mongoose.model('User',UserSchema);

module.exports={User}
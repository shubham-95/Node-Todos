var env =process.env.NODE_ENV;


if(env === 'production'){
    console.log(env,"****");
    process.env.PORT=9000
    process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
} 
else if(env === 'development'){
    console.log(env,"****");
    process.env.PORT=3000;
    process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
}


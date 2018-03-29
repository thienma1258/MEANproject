//express
var express=require('express');
var app=express();
//body parser express
var bodyParser=require('body-parser');
var port=process.env.PORT||8080;
var server = require('http').Server(app);
var io = require('socket.io')(server);
const cassandra = require('cassandra-driver');
// app.use(express.bodyParser({limit: '5mb'}));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json());
var morgan=require('morgan');//morgan
app.use(morgan('dev'));
//router
var router=express.Router();
//path
var path=require('path');

// connect to cassandra
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatonline' });
client.connect(function (err) {
   if(err){console.log(err);}
   else{
       console.log("connect to cassandradb success");
   }
  });
// //api router


var listuser=require('./api/socketio')(app,io,client);
var appRoutes=require('./api/user')(router,client,listuser);
app.use('/api',appRoutes);

//public folder
app.use(express.static(__dirname+'/public'));
app.use("/styles",  express.static(__dirname + '/public/assets/css'));
app.use("/images",  express.static(__dirname + '/images'));
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname+'/public/app/view/index.html'));
 });


 //return HTTP server instance
 server.listen(port,function(){
    console.log("Sever running in port"+port);
});


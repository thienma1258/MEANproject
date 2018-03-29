var jwt = require('jsonwebtoken');
const request=require('request');
var secret="thienma1258";
// all user current login
var user=[];
var worldrooms=[];
var typequestion={
	9:'General Knowledge',
	10:'Entertainment: Books',
	11:'Entertainment: Film',
	12:'Entertainment: Music',
	13:'Entertainment: Musicals & Theatres',
	14:'Entertainment: Television',
	15:'Entertainment: Video Games',
	16:'Entertainment: Board Games',
	17:'Science & Nature',
	18:'Science: Computers',
	19:'Science: Mathematics',
	20:'Mythology',
	21:'Sports',
	22:'Geography',
	23:'History',
	24:'Politics',
	25:'Art',
	26:'Celebrities',
	27:'Animals',
	28:'Vehicles',
	29:'Entertainment: Comics',
	30:'Science: Gadgets',
	31:'Entertainment: Japanese Anime & Manga',
	32:'Entertainment: Cartoon & Animations'

}
var type=false;

function getuniqueid(client,callback){
	let query="SELECT now() FROM system.local";
	client.execute(query,(err,data)=>{
		if(err) console.log(err);
		else{
			var uuid=data.first()['system.now()'];
			callback(uuid.toJSON());
		}
	})
}

function disconnectted(socket,io){
	socket.on('disconnect',()=>{
		console.log(socket.user.username+" has disconnected");
		for (i = 0; i < user.length; i++) { 
			if(user[i].username==socket.user.username){
				user.splice(i,1);
				break;
			}
	}
	io.sockets.emit('listupdate',user);

		});
}
function loadquiz(numberquestion,type,diffcult,typequestion,callback){
	let url="https://opentdb.com/api.php?amount="+numberquestion+"&category="+type+"&difficulty="+diffcult;
	if(typequestion!=null)
		url=url+"&type="+typequestion;
	request(url,{json:true},(err,res,body)=>{
		if(err) return;
		else{
			if(body.response_code==0){
		callback(body.results);
		// console.log(body);
			}
		}
	});
}

function loaddata(client,callback){
// console.log('test');
	if(worldrooms.length==0){
		// load data

		let query="select chatdetail from conversationdetails where name='Rooms world'";
		client.execute(query,(err,data)=>{
			if(err) console.log(err);
			else{
				worldrooms=data.first()['chatdetail'];
				callback();
			}
		})
	}
	else{
		callback();	
	}
}
function chatworld(client,socket,io){
	socket.on('chatworld',(text)=>{
		// get dateofnow;
		const query='SELECT dateof(now()) FROM system.local ';
		client.execute(query,(error,data)=>{
			// console.log(data);
			if(error){
				// console.log(error);
			}
			const now=data.first()['system.dateof(system.now())'];
			var information={
				name:socket.user.username,
				image:socket.user.image,
				time:now,
				content:text
			};
			let query="update conversationdetails set chatdetail=chatdetail+{{name:'"+socket.user.name+"',image:'"+socket.user.image+"',time:dateof(now()),content:'"+text+"'}}where name='Rooms world'";
		// insert into table;
		// if success;
		client.execute(query,(err)=>{
			if(err) console.log(err);
			else{
				// add success
				worldrooms.push(information);
				io.sockets.emit('updateworldrooms',worldrooms);
			}
		})

		});


	});
}
function sendcategory(io){
	io.sockets.emit('category',typequestion);
}
function startchallenge(socket,io,client){
	socket.on('startchallenge',(data)=>{
		if(type==false){
		var information={
			user:socket.user,
			data:data,
		}
		socket.broadcast.emit('invitechallenge',information);
		}
		else{
			socket.emit('refuse','One competition still happening');
		}
	});

}
module.exports=function(app,io,client){
	getuniqueid(client,(data)=>{
		console.log(data);
	});
		// loadquiz(1,9,'easy',null,(data)=>{
		// 	console.log(data);	
		// });
	// token
	// check if worldrooms is empty;
	io.use(function(socket, next) {
		var handshakeData = socket.request;
		var token= handshakeData._query['token'];
		jwt.verify(token,secret, function(err, decoded) {
			if(err) return null
			let flag=0;
			// check if username already exsist
			user.forEach((row)=> {
				if(row.username==decoded.username){
					flag=1;
				}
				});
			// if doesn't login
			if(flag==0){
			 socket.user=decoded;
			user.push(decoded);
			 next();
			}
			else if (flag==1){
				socket.user=decoded;
				next();
			}
		})
	  })

	io.on("connection", (socket)=>{

		console.log(socket.user.username+" has connected");
		io.sockets.emit('listupdate',user);

		loaddata(client,()=>{

			// console.log('callback');
			socket.emit('listchat',worldrooms);
		});
		// some one edisconnected
		disconnectted(socket,io);
		chatworld(client,socket,io);
		sendcategory(io);
		io.emit('state',type);
		startchallenge(socket,io,client);
	});


	return user;
}
var jwt = require('jsonwebtoken');
var secret="thienma1258";

var bcrypt=require('bcrypt-nodejs');
const fs=require('fs');

module.exports=function(router,client,listuser){
    router.post('/authenticate',(req,res)=>{
     const query="Select * from user where username=?";
    //  console.log(req.body);
     const params=[req.body.username];
     client.execute(query,params,(error,data)=>{
        if(error){
           console.log(error);
            return res.json({success:false,messege:'Your username or password is not correct'});
        }
        else{


            // check
            const user=data.first();
            let flag=0;
            if(listuser==null) console.log("null object");
            listuser.forEach((onlineuser)=> {
                if(onlineuser.username==user.username){
                     res.json({success:false,messege:"Someone already login with that username"});
                    flag=1;
                }
             });
             if(flag==1){
                 return;
             }
            // console.log(data);
          if(user==null) return res.json({success:false,messege:'Please register'});
          
            let comparepassword=  bcrypt.compareSync(req.body.password,user.password);
            console.log(comparepassword);
            if(comparepassword){
                 var token=jwt.sign({username:user.username,email:user.email,image:user.image,name:user.name},secret,{expiresIn:'1h'});
             return   res.json({success:true,messege:'Your login success',token:token});
            }
            else{
                return res.json({success:false,messege:'Your username or password is not correct'});
            }
        }
     });
    });

     router.post('/users', (req,res)=>{
        //  check
        if(req.body.username==null||req.body.password==null||req.body.email==null||req.body.image==null){
         return   res.json({success:false,messege:'Please fill all information'});
        }
        console.log("Save user"+req.body.username);
        let password=req.body.password;
         bcrypt.hash(password, null, null, function(err, hash) {
            // Store hash in your password DB.
            if(err) return res.json({success:false,messege:"Could not hash password"});
            password=hash;
        //   wrilte file;
        const namefile="images/"+req.body.username+"represent.png";
        fs.writeFile(namefile,req.body.image.base64,'base64',(err)=>{
            console.log(err);
            var flat=0;
            const query = 'INSERT INTO user (username, name,email, image, createdate,password) VALUES (?, ?, ?,?,dateof(now()),?)';
            const params = [req.body.username, req.body.name, req.body.email,namefile,password];
             client.execute(query, params, { prepare: true }, function (err) {
                flag=1;
                
                console.log("user save success");
               return  res.json({success:true,messege:"Account success"});
              });
        });
        });
        if(flag==1) return;
            return  res.status(400).json({success:false,messege:"Could not hash password"});
     } );
// authentication
    router.use(function(req,res,next){
		var token=req.body.token||req.body.query||req.headers['x-access-token'];
		if(token){
			// verify a token symmetric
		jwt.verify(token,secret, function(err, decoded) {
 		if(err){
 		return	res.json({success:false,messege:"token Invalid"});
 		}
 			else{
 			req.decoded=decoded;
 			next();
 		}
			});
 		}
		else{
		return	res.json({success:false,messege:"No token"});
		}
    });
    router.get('/aboutme',(req,res)=>{
        return res.json({success:true,user:req.decoded});
    });


    return router;
}

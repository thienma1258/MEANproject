angular.module('mainControllers',['authServices'])
.controller('mainCtrl',function($location,$timeout,Auth,$rootScope,$window){
	var app=this;
	app.loadme=false;
	$rootScope.$on('$routeChangeStart', function(event) {
   
// 		if(Auth.isLogin()){
// 	//console.log("user login in");
// 	app.isLoggedIn=true;
// 	Auth.getcurrentUser().then(function(data){
// 		//console.log(data);
// 			app.loadme=true;
// 		app.username=data.data.username;
// 		app.email=data.data.email;
// 	});
// }
// else{
// 	app.isLoggedIn=false;
// 	app.username="";
// 	app.loadme=true;
// 	app.email="";
// 	//console.log("Fail user not login");
// }
		/* Act on the event */
	});
//facebook
app.facebook=function(){
    alert("not open yet");
	// $window.location=$window.location.protocol+"//"+$window.location.host+'/auth/facebook';
}
app.register=function(){
	$location.path('/register');
}
//google login
app.google=function(){
    alert("not open yet");
	// $window.location=$window.location.protocol+"//"+$window.location.host+'/auth/google';
}
//Do login
app.doLogin=function(){
	app.errorMsg=false;
	app.Loading=true;
	Auth.login(app.Data).then(function(data){
			if(data.data.success==true){
//sucess login
//redicter to home
 			app.successMsg=data.data.messege+" Redirecting...";
 			app.Loading=false;
 			$timeout(function(){
 				$location.path('/chatonline');
 			},2000);
			}
			else{
//fail login
//alert all notification
			app.Loading=false;
			app.errorMsg=data.data.messege;
			}
		});
}
//Login
app.logout=function(){
	Auth.logOut();
	$location.path('/logout');
	$timeout(function(){
		$location.path('/');
	},2000);
}
return app;
});
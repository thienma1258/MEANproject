angular.module('userControllers',['userServices'])
.controller('regCtrl', function($location,$timeout,User){
	var app=this;
	app.regUser=function(regData){
		app.errorMsg=false;
		app.Loading=true;
		//console.log("form submit");
		User.create(app.regData).then(function(data){
			console.log(data);
			if(data.data.success==true){
//sucess register
//redicter to home
	app.errorMsg=false;
 			app.successMsg=data.data.messege+" Redirecting...";
 			app.Loading=false;
 			$timeout(function(){
 				$location.path('/');

 			},2000);
        }
			else{
//fail register
//alert all notification
		app.successMsg="";
			app.Loading=false;
			app.errorMsg=data.data.messege;
			}
		});
	}
	app.onFileSelect=function($event){
		console.log($event);
	}
	return app;
})
.controller('fbCtrl', function($routeParams,Auth,$location,$window){
	var app=this;
	if($window.location.pathname=='/facebookerr'){
		app.errorMsg="Facebook e-mail not found in database";
	}
	else{
	Auth.facebook($routeParams.token);
	$location.path('/');
	}
})
.controller('googleCtrl', function($routeParams,Auth,$location,$window){
	var app=this;
	if($window.location.pathname=='/googleerr'){
		app.errorMsg="Google e-mail not found in database";
	}
	else{
	Auth.facebook($routeParams.token);
	$location.path('/');
	}
});

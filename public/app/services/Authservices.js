angular.module('authServices',[])
.factory('Auth', function($http,Authtoken,$q){
	AuthFactory={};
	// Auth.login(loginData);
	AuthFactory.login=function(loginData){
return $http.post('/api/authenticate',loginData).then(function(data){
	Authtoken.setToken(data.data.token);
	return data;
});
	};
	//Auth.isLogin();
	AuthFactory.isLogin=function(){
		if(Authtoken.getToken())
			return true;
		return false;
	}
	//Auth.logOut();
	AuthFactory.logOut=function(){
		Authtoken.setToken();//remove token
	};
	//Auth.getcurrentUser();
	AuthFactory.getcurrentUser=function(){
		if(Authtoken.getToken()){
			return $http.post('/api/me');
		}
		else{
			$q.reject({messege:"User has no token"});
		}
	}
	//Auth.facebook(token);
	AuthFactory.facebook=function(token){
		Authtoken.setToken(token)
	};
	return AuthFactory;
})

.factory('Authtoken',function($window){
	var authTokenFactory={};
	//Authtoken.setToken(token)
	authTokenFactory.setToken=function(token){
		if(token)
		$window.localStorage.setItem('token',token);
		else{
			$window.localStorage.removeItem('token');
		}
	};
	//Authtoken.getToken();
	authTokenFactory.getToken=function(){
		return $window.localStorage.getItem('token');
	};
	return authTokenFactory;
})
.factory('AuthInterceptors',function(Authtoken){
	var AuthInterceptors={};
	// AuthInterceptors.request;
	AuthInterceptors.request=function(config){
var token=Authtoken.getToken();
if(token){
	config.headers['x-access-token']=token;
}
else{

}
return config;
	};
	return AuthInterceptors;
});
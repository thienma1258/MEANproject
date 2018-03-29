angular.module('chatServices',['authServices'])
.factory('Chatservices', function($http,Authtoken){
var chatservices=this;


chatservices.test=function() {
  return $http.get('/api/aboutme');
};
chatservices.token=function(){
  return Authtoken.getToken();
}
return chatservices;
}).factory('io',function($window){
  return $window.io
});
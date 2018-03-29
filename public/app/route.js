var route=angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider,$locationProvider){
    $routeProvider.
    when('/',{
        templateUrl:'app/view/pages/login.html',
        controller:'mainCtrl',
        controllerAs:'login',
        authenticate:false
    })
    .when('/register',{
        templateUrl:'app/view/pages/register.html',
		controller:'regCtrl',
		controllerAs:'register',
		authenticate:false
    })
    .when('/chatonline',{
        templateUrl:'app/view/pages/chat.html',
        controller:'chatCtrl',
        controllerAs:'chat',
        authenticate:true
    })
    .otherwise({
        templateUrl:'app/view/pages/notfound.html'
    });

    $locationProvider.html5Mode(true);
});
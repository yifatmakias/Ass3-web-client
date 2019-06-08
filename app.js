let app = angular.module('myApp', ["ngRoute"]);
// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        // about
        .when('/about', {
            // this is a template url
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        .when('/restorePassword', {
            // this is a template url
            templateUrl: 'pages/restorePassword/restorePassword.html',
            controller : 'restorePassController as passCtrl'
        })
        .when('/register', {
            // this is a template url
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as registerCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});

angular.module("myApp")
.controller("app.js", function ($scope, $window) {
    $window.localStorage.setItem('username', 'guest');
    $scope.hello_user = "Hello " + $window.localStorage.getItem('username');
});
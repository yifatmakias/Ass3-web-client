let app = angular.module('myApp', ["ngRoute"]);

// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .when('/logout', {
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
        .when('/poiLogin', {
            // this is a template url
            templateUrl: 'pages/poiLogin/poiLogin.html',
            controller : 'poiLoginController as poiLoginCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});

angular.module('myApp')
    .service('sharedProperties', function () {
        var property = 'guest';
        var role = 'guest';
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
            getRole: function () {
                return role;
            },
            setRole: function(value) {
                role = value;
            }
        };
    });

 angular.module("myApp")
    .controller("app.js", function ($scope, sharedProperties, $window, $rootScope, $location) {
        $scope.role = sharedProperties.getRole();
        $scope.hello_user = "Hello " + sharedProperties.getProperty();
        $scope.$on('change-property-event', function() {
            $scope.hello_user  = "Hello " + sharedProperties.getProperty();
        });  
        $scope.$on('change-role-event', function() {    
            $scope.role = sharedProperties.getRole();
        });
        $scope.logout = function () {
            sharedProperties.setProperty('guest');
            $rootScope.$broadcast('change-property-event');
            sharedProperties.setRole('guest');
            $rootScope.$broadcast('change-role-event');
            $window.localStorage.clear();
        }
    });
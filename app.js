let app = angular.module('myApp', ["ngRoute", 'ui.bootstrap']);

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
        .when('/poi', {
            // this is a template url
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl'
        })
        .when('/favoritepoi', {
            // this is a template url
            templateUrl: 'pages/favoritepoi/favoritePoi.html',
            controller : 'favoritepoiController as favoritepoiCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});

angular.module('myApp')
    .service('sharedProperties', function () {
        var property = 'guest';
        var role = 'guest';
        var poi_page = 'poi by categories';
        var favorite_poi_page = 'favorite poi';
        var arrFavoritePOI = new Array();
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
            },
            getPoiPage: function () {
                return poi_page;
            },
            setPoiPage: function(value) {
                poi_page = value;
            },
            getFavoriteArr: function () {
                return arrFavoritePOI;
            },
            addFavorite: function(value) {
                arrFavoritePOI.push(value);
            },
            removeFavorite: function(index) {
                arrFavoritePOI.splice(index,1);
            },
            getFavoriteArrSize: function() {
                return Object.keys(arrFavoritePOI).length;
            },
            getFavoritePoiPage: function () {
                return favorite_poi_page;
            },
            setFavoritePoiPage: function(value) {
                favorite_poi_page = value;
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
            $window.sessionStorage.clear();
        }
    });
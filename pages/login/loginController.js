// login controller

angular.module("myApp")
.controller("loginController", function ($scope, $http, sharedProperties, $rootScope, $window, $location) {
    var arrPOINames = new Array();
    var arrPOISrcImg = new Array();
    $http({
        method: 'GET',
        url: 'http://localhost:3000/getRandomPOI/1'
     }).then(function (response){
        var POIJsons = response.data
        for (var i=0; i<Object.keys(POIJsons).length; i++) {
            arrPOINames.push(POIJsons[i].poi_name);
            arrPOISrcImg.push(POIJsons[i].poi_pic);
        }
        $scope.randomPOINames = arrPOINames;
        $scope.randomPOImges = arrPOISrcImg;
     },function (error){
        alert(error);
     });
     $scope.submit = function (event) {
      $http.post('http://localhost:3000/login', {user_name: $scope.username, password: $scope.password})
      .then(function (response){
         if (response.data === 'No such user') {
            alert("Your username or password are not correct. Try again");
         }
         else {
            $window.localStorage.setItem('token', response.data);
            sharedProperties.setProperty($scope.username);
            $rootScope.$broadcast('change-property-event');
            sharedProperties.setRole('loggedIn');
            $rootScope.$broadcast('change-role-event');
            $location.path('/poiLogin');
         }
         event.preventDefault();
      },function (error){
         alert(error);
      });
     }
});
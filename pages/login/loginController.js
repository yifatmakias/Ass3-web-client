// login controller

angular.module("myApp")
.controller("loginController", function ($scope, $http, sharedProperties, $rootScope, $window, $location, $uibModal) {
    var arrPOI = new Array();
    $http({
        method: 'GET',
        url: 'http://localhost:3000/getRandomPOI/1'
     }).then(function (response){
        var POIJsons = response.data
        for (var i=0; i<Object.keys(POIJsons).length; i++) {
            arrPOI.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
        }
        $scope.randomPOI = arrPOI;
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
            $window.sessionStorage.setItem('token', response.data);
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
     $scope.open = function(param) {
      var modalInstance =  $uibModal.open({
        templateUrl: 'modalContent.html',
        controller: "ModalContentCtrl",
        size: '',
        backdrop: 'static',
        resolve: {
           data: function () {
              return param;
           }
        }
      });
    };
});

angular.module("myApp")
.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, data) {
   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIDetails/'+ data
   }).then(function (response){
      var POIJsons = response.data[0];
      var reviewsJsons = response.data[1];
      var arrReviews = new Array();
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
         $scope.name = POIJsons[i].poi_name;
         $scope.category = POIJsons[i].poi_category;
         $scope.desc = POIJsons[i].poi_desc;
         $scope.rank = POIJsons[i].poi_rank/5 * 100;
         $scope.num_of_viewers = POIJsons[i].num_of_viewers;
      }
      for (var i=0; i<Object.keys(reviewsJsons).length; i++) {
         arrReviews.push({
            'name': reviewsJsons[i].user_name, 
            'date': reviewsJsons[i].review_date,
            'rank': reviewsJsons[i].review_rank,
            'desc': reviewsJsons[i].review_description
         })
      }
      $scope.reviews = arrReviews;

   },function (error){
      alert(error);
   });
   $scope.ok = function(){
     $uibModalInstance.close("Ok");
   }
 });
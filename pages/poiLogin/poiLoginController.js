// login controller
angular.module("myApp")
.controller("poiLoginController", function ($scope, $http, $window, $uibModal) {
   var arrPOIRecomended = new Array();
   var arrPOISaved = new Array();
   $http({
       method: 'GET',
       url: 'http://localhost:3000/private/getRecomendedPOI',
       headers: {
          'x-auth-token': $window.sessionStorage.getItem('token')
       }
    }).then(function (response){
       var POIJsons = response.data
       for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrPOIRecomended.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'category':POIJsons[i].poi_category});
       }
       $scope.recomendedPOI = arrPOIRecomended;
    },function (error){
       alert(error);
    });

    $http({
      method: 'GET',
      url: 'http://localhost:3000/private/getSavedPOI',
      headers: {
         'x-auth-token': $window.sessionStorage.getItem('token')
      }
   }).then(function (response){
      var POIJsons = response.data
      if (Object.keys(POIJsons).length === 0) {
         $scope.no_saved_message = "No saved POI to show"
      }
      for (var i=Object.keys(POIJsons).length-1; i>Object.keys(POIJsons).length-3; i--) {
         arrPOISaved.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
      }
      $scope.savedPOI = arrPOISaved;
   },function (error){
      alert(error);
   });
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
.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, data, $rootScope) {
   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIDetails/'+ data
   }).then(function (response){
      var POIJsons = response.data[0];
      var reviewsJsons = response.data[1];
      var arrReviews = new Array();
      var favoriteArr = sharedProperties.getFavoriteArr();
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
         $scope.name = POIJsons[i].poi_name;
         $scope.category = POIJsons[i].poi_category;
         $scope.desc = POIJsons[i].poi_desc;
         $scope.rank = POIJsons[i].poi_rank/5 * 100;
         $scope.num_of_viewers = POIJsons[i].num_of_viewers;
         if (favoriteArr.includes(POIJsons[i].poi_id)){
            $scope.POI.favorite = true;
          }
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
   $scope.change = function(POI) {
      var favoriteArray = sharedProperties.getFavoriteArr();
      if (POI.favorite === true && !favoriteArray.includes(POI.poi_id)){
        sharedProperties.addFavorite(POI.poi_id);
      }
      if (POI.favorite === false && favoriteArray.includes(POI.poi_id)) {
        var index = favoriteArray.indexOf(POI.poi_id);
        sharedProperties.removeFavorite(index);
      }
      $rootScope.$broadcast('change-favoritelist-event');
      console.log(favoriteArray);
   }

   $scope.ok = function(){
     $uibModalInstance.close("Ok");
   }
 });
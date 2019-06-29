
angular.module("myApp")
.controller("favoritepoiController", function ($scope, $http, $uibModal, sharedProperties, $rootScope, $window) {
   $scope.role = sharedProperties.getRole();
   $scope.$on('change-role-event', function() {    
      $scope.role = sharedProperties.getRole();
  });
   var arrFavoritePOIId = new Array();
   var arrFavoritePOI = new Array();
   $scope.favorite_poi_page = sharedProperties.getFavoritePoiPage();
   $scope.$on('change-favoritepoipage-event', function() {
      $scope.favorite_poi_page  = sharedProperties.getFavoritePoiPage();
  });
  $scope.$on('remove-poi-event', function() {
   arrFavoritePOI = new Array();
   arrFavoritePOIId = new Array();
   $http({
      method: 'GET',
      url: 'http://localhost:3000/private/getSavedPOI',
      headers: {
        'x-auth-token': $window.sessionStorage.getItem('token')
     }
   }).then(function (response){
      var POIJsons = response.data
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
        arrFavoritePOI.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false, 'category': POIJsons[i].poi_category, 'order_index': POIJsons[i].order_index});
        arrFavoritePOIId.splice(POIJsons[i].order_index-1, 0, POIJsons[i].poi_id);
      }
      $scope.favoritePOI = arrFavoritePOI;
   },function (error){
      alert(error);
   });
}); 
   $http({
       method: 'GET',
       url: 'http://localhost:3000/private/getSavedPOI',
       headers: {
         'x-auth-token': $window.sessionStorage.getItem('token')
      }
    }).then(function (response){
       var POIJsons = response.data
       for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrFavoritePOI.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false, 'category': POIJsons[i].poi_category, 'order_index': POIJsons[i].order_index});
         arrFavoritePOIId.splice(POIJsons[i].order_index-1, 0, POIJsons[i].poi_id); 
      }
       $scope.favoritePOI = arrFavoritePOI;
    },function (error){
       alert(error);
    });

     $scope.filter = function () {
        arrPOIByCategory = new Array();
        if ($scope.category === '' || $scope.category === null || $scope.category === 'nofilter') {
         sharedProperties.setFavoritePoiPage('favorite poi');
         $rootScope.$broadcast('change-favoritepoipage-event');
        }
        else {
         sharedProperties.setFavoritePoiPage('favorite poi by category');
         $rootScope.$broadcast('change-favoritepoipage-event');
         for (var i=0; i<Object.keys(arrFavoritePOI).length; i++) {
            if (arrFavoritePOI[i].category === $scope.category){
               arrPOIByCategory.push({'id': arrFavoritePOI[i].id, 'name': arrFavoritePOI[i].name, 'pic': arrFavoritePOI[i].pic, 'rank': arrFavoritePOI[i].rank, 'favorite': false});
            }
          }
          $scope.POI_by_category = arrPOIByCategory;
        }
     }

     $scope.up = function(order_index) {
        var arr_index = order_index - 1;
        var arr_length = Object.keys(arrFavoritePOIId).length;
        var id_to_move = arrFavoritePOIId.splice(arr_index,1);
        if (arr_index === 0) {
           arrFavoritePOIId.splice(arr_length-1, 0, id_to_move[0]);
        }
        else {
         arrFavoritePOIId.splice(arr_index-1, 0, id_to_move[0]);
        }
        favorite_json = {'poi_list': arrFavoritePOIId};
        var req = {
           method: 'POST',
           url: 'http://localhost:3000/private/saveFavoriteList',
           headers: {
              'x-auth-token': $window.sessionStorage.getItem('token')
           },
           data: favorite_json
          }
        $http(req)
        .then(function (response){
           console.log(response.data)
           if (response.data === 'insert successfully') {
            //$rootScope.$broadcast('remove-poi-event');
            for (var i=0; i<Object.keys(arrFavoritePOI).length;i++){
               for (var j=0; j<Object.keys(arrFavoritePOIId).length;j++){
                  if (arrFavoritePOI[i].id === arrFavoritePOIId[j]) {
                     arrFavoritePOI[i].order_index = j+1;
                  }
               }
            }
           }
        },function (error){
           alert(error);
        });
     }

     $scope.removePoi = function(param){
      $http({
         method: 'DELETE',
         url: 'http://localhost:3000/private/deleteSavedPOI/' + param,
         headers: {
           'x-auth-token': $window.sessionStorage.getItem('token')
        }
      }).then(function (response){
         if (response.data === 'deleted successfully') {
            alert("You have successfully removed a POI");
         }
      },function (error){
         alert(error);
      });
      $rootScope.$broadcast('remove-poi-event');
      }

     $scope.sortByRating = function () {
      sharedProperties.setFavoritePoiPage('favorite poi sorted by rank');
      $rootScope.$broadcast('change-favoritepoipage-event');
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

    $scope.addReview = function(param) {
      var modalInstance =  $uibModal.open({
        templateUrl: 'modalReview.html',
        controller: "ModalReviewCtrl",
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
.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, data, sharedProperties, $rootScope) {
   $scope.role = sharedProperties.getRole();
   $scope.$on('change-role-event', function() {    
      $scope.role = sharedProperties.getRole();
  });
  
   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIDetails/'+ data
   }).then(function (response){
      var POIJsons = response.data[0];
      var reviewsJsons = response.data[1];
      var arrReviews = new Array();
      $scope.POI = POIJsons[0];
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
   };
 });

 angular.module("myApp")
.controller('ModalReviewCtrl', function($scope, $http, $uibModalInstance, data, sharedProperties, $window) {
   $scope.ok = function(){
      if (!($scope.rank == 1 || $scope.rank == 2 || $scope.rank == 3 || $scope.rank == 4 || $scope.rank == 5)) {
         alert("You must choose a rank in order to add a review");
         return;
      }
      review_json = {'user_name': sharedProperties.getProperty(), 'poi_id': data, 'rank': $scope.rank, 'description': $scope.revDescription};
      var req = {
         method: 'POST',
         url: 'http://localhost:3000/private/insertPoiReview',
         headers: {
            'x-auth-token': $window.sessionStorage.getItem('token')
         },
         data: review_json
        }
      $http(req)
      .then(function (response){
         if (response.data === 'insert successfully') {
            alert("You have successfully added a review");
         }
      },function (error){
         alert(error);
      });
     $uibModalInstance.close("Ok");
   }
   $scope.cancel = function(){
      $uibModalInstance.close("Ok");
   }
 });